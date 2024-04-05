import vec3 from "vec3";

import MessagePlayer from "../../MessagePlayer.js";

/**
 * Action cmd
 */
export default class ActionCmd {
    debug = false;
    
    /**
     * 
     * @param {*} bot 
     * @param {MessagePlayer} io 
     * @param {*} args 
     */
    constructor(bot, io, args) {
        this.bot = bot;
        this.io = io;
        
        // Next arg
        const arg = args[0];
        
        if(arg === "dig") {
            const nextArg = args[1];
            if(nextArg === "down") {
                let target = undefined;
                
                if (bot.targetDigBlock) {
                    io.msg(`already digging ${bot.targetDigBlock.name}`);
                } else {
                    // One block below
                    target = bot.blockAt(bot.entity.position.offset(0, -1, 0));
                    
                    (async () => {
                        if (target && bot.canDigBlock(target)) {
                            if(this.debug) {
                                io.msg(`Starting to dig ${target.name}`);
                            }
                            
                            try {
                                await bot.dig(target);
                                if(this.debug) {
                                    io.msg(`Finished digging ${target.name}`);
                                }
                            } catch (err) {
                                console.log(err.stack);
                            }
                        } else {
                            io.msg('Cannot dig');
                        }
                    })();
                }
            }
        } else if(arg === "build") {
            const nextArg = args[1];
            if(nextArg === "down") {
                this.jumpAndPlaceBlock();
            }
        } else if(arg === "equipandplace") {
            if(this.debug) {
                io.setOk().msg("Equip and place");
            }
            // Equip a block and place on the spot
            if(args.length > 1) {
                const nextArg = args[1];
                this.equipAndPlaceBlock(nextArg);
            }
        }
    }
    
    /**
     * Equip and jump place on the spot
     */
    equipAndPlaceBlock(blockName) {
        const bot = this.bot;
        const io = this.io;
        
        let itemsByName = undefined;
        if (this.bot.supportFeature('itemsAreNotBlocks')) {
            itemsByName = 'itemsByName';
        } else if (this.bot.supportFeature('itemsAreAlsoBlocks')) {
            itemsByName = 'blocksByName';
        }
        
        const blockType = this.bot.registry[itemsByName][blockName];
        (async () => {
            try {
                await bot.equip(blockType.id, 'hand');
                if(this.debug) {
                    io.setOk().msg('Equipped block');
                }
            
                this.jumpAndPlaceBlock();
            } catch (err) {
                io.setError().msg(`Unable to equip block with name '${blockName}': ${err.message}`);
            }
        })();
    }
    
    /**
     * Place hand held block down
     */
    jumpAndPlaceBlock() {
        const bot = this.bot;
        const io = this.io;
        
        // Take as reference block the one below
        const referenceBlock = bot.blockAt(bot.entity.position.offset(0, -1, 0));
        const jumpY = Math.floor(bot.entity.position.y) + 1.0;
        this.bot.setControlState('jump', true);
        bot.on('move', placeIfHighEnough);
        
        let once = true;
        let tryCount = 0;
        async function placeIfHighEnough () {
            // If the player is high enough to place the block do it
            if (bot.entity.position.y > jumpY) {
                try {
                    await bot.placeBlock(referenceBlock, vec3(0, 1, 0));
                    bot.setControlState('jump', false);
                    bot.removeListener('move', placeIfHighEnough);
                    
                    if(once) {
                        io.setOk().msg('Placing a block was successful');
                        once = false;
                    }
                } catch (err) {
                    tryCount++;
                    if (tryCount > 10) {
                        io.setError().msg(err.message);
                        bot.setControlState('jump', false);
                        bot.removeListener('move', placeIfHighEnough);
                    }
                }
            }
        }
    }
}

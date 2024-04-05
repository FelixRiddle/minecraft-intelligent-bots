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
                const referenceBlock = bot.blockAt(bot.entity.position.offset(0, -1, 0));
                const jumpY = Math.floor(bot.entity.position.y) + 1.0;
                bot.setControlState('jump', true);
                bot.on('move', placeIfHighEnough);
                
                let tryCount = 0;
                async function placeIfHighEnough () {
                    // If the player is high enough to place the block do it
                    if (bot.entity.position.y > jumpY) {
                        try {
                            await bot.placeBlock(referenceBlock, vec3(0, 1, 0));
                            bot.setControlState('jump', false);
                            bot.removeListener('move', placeIfHighEnough);
                            io.setOk().msg('Placing a block was successful');
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
    }
}

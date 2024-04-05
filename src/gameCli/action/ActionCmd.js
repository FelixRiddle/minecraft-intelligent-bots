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
        
        // Next arg
        const arg = args[0];
        if(arg === "dig") {
            const nextArg = args[1];
            if(nextArg === "down") {
                io.setOk().msg("Digging one block down.");
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
        }
    }
}

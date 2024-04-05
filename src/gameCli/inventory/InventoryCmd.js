/**
 * Inventory management
 */
export default class InventoryCmd {
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
        if(arg === "equip") {
            if(args.length > 1) {
                const nextArg = args[1];
                if(nextArg === "dirt") {
                    // Equip a dirt block if the player has
                    this.equipDirt();
                }
            } else {
                
            }
        } else if(arg === "drop") {
            if(args.length > 1) {
                const nextArg = args[1];
                if(nextArg === "all") {
                    // Drop all
                }
            } else {
                
            }
        } else if(arg === "sort") {
            
        }
    }
    
    /**
     * Equip an item
     */
    async equipDirt () {
        let itemsByName = undefined;
        if (this.bot.supportFeature('itemsAreNotBlocks')) {
            itemsByName = 'itemsByName';
        } else if (this.bot.supportFeature('itemsAreAlsoBlocks')) {
            itemsByName = 'blocksByName';
        }
        
        try {
            await this.bot.equip(this.bot.registry[itemsByName].dirt.id, 'hand');
            this.io.setOk().msg('equipped dirt');
        } catch (err) {
            this.io.setError().msg(`unable to equip dirt: ${err.message}`);
        }
      }
}

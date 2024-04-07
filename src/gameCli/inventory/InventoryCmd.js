import equipItemByName from "../../operation/inventory/equip/equipItemByName.js";

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
                if(!nextArg) {
                    return this.io.error("No item specified");
                }
                
                this.io.ok(`Equipping '${nextArg}'`);
                equipItemByName(this.bot, this.io, nextArg);
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
}

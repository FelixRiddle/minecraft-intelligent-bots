import CollectTree from "../../actions/collect/tree/CollectTree.js";
import condensedInventory from "../../view/inventory/condensedInventory.js";

/**
 * Gather wood
 */
export default class GatherWood {
    constructor(bot, targets = {}, quantity = 8, active = false) {
        this.bot = bot;
        this.active = active;
        this.targets = targets;
        this.stateName = "gatherWood";
    }
    
    /**
     * On state entered
     */
    async onStateEntered() {
        console.log(`[State(${this.stateName})] We've got to gather wood!`);
        
        // console.log(`Inventory: `, condensedInventory(this.bot));
        
        // Try to collect tree
        // Either the bot doesn't wait to finish
        // Or I'm missing actions after this one
        const collectTree = new CollectTree(this.bot, this.targets.io);
        console.log(`[State(${this.stateName})] Finished gathering wood`);
    }
    
    /**
     * On state exited
     */
    onStateExited() {
        console.log(`Wood gather end`);
    }
}

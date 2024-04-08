import hasEnoughWoodForAllTools from "../../../inventory/wood/tools/hasEnoughWoodForAllTools.js";
import condensedInventory from "../../../view/inventory/condensedInventory.js";

/**
 * Check wood to craft all wooden tools
 */
export default class CheckWoodenToolsRequirement {
    constructor(bot, targets = {}, active = false) {
        this.bot = bot;
        this.active = active;
        this.targets = targets;
        this.stateName = "checkWoodenToolsRequirement";
    }
    
    /**
     * On state entered
     */
    onStateEntered() {
        console.log(`[State(${this.stateName})]`);
        console.log(`Inventory: `, condensedInventory(this.bot));
        
        const woodOk = hasEnoughWoodForAllTools(this.bot);
        
        this.targets.canCraftWoodenTools = woodOk;
    }
    
    /**
     * On state exited
     */
    onStateExited() {
    }
}

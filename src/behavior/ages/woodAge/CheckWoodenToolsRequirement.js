import { hasPlanksQuantity } from "../../../operation/inventory/check/hasPlanks.js";

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
        // Got some planks
        // Check quantity
        // We have got to make sticks for each tool
        const sword = 2;
        const pickaxe = 3;
        const axe = 3;
        const hoe = 2;
        const shovel = 1;
        
        // 9 Sticks required
        // 6 planks to make 12 sticks
        const sticks = 6;
        // 17
        const totalPlanksRequired = sword + pickaxe + axe + hoe + shovel + sticks;
        
        const woodOk = hasPlanksQuantity(this.bot, totalPlanksRequired);
        this.targets.canCraftWoodenTools = woodOk;
    }
    
    /**
     * On state exited
     */
    onStateExited() {
    }
}

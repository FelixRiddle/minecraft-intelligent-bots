import { hasWoodQuantity } from "../../../operation/inventory/check/hasPlanks";

/**
 * Check wood logs
 */
export default class WoodAgeCheckWoodLogs {
    constructor(bot, targets = {}, active = false) {
        this.bot = bot;
        this.active = active;
        this.targets = targets;
        this.stateName = "woodAgeCheckWoodLogs";
    }
    
    /**
     * On state entered
     */
    onStateEntered() {
        // 5 logs are required to craft all wooden tools
        const woodOk = hasWoodQuantity(this.bot, totalPlanksRequired);
        this.targets.canCraftWoodenTools = woodOk;
    }
    
    /**
     * On state exited
     */
    onStateExited() {
    }
}

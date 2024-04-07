import getBestPickaxe from "../../operation/inventory/check/getBestPickaxe.js";

/**
 * Pickaxe tier
 */
export default class PickaxeTier {
    constructor(bot, targets = {}, active = false) {
        this.bot = bot;
        this.active = active;
        this.targets = targets;
        this.stateName = "pickaxeTier";
    }
    
    /**
     * On state entered
     */
    onStateEntered() {
        // Set best pickaxe
        this.targets.bestPickaxe = getBestPickaxe(this.bot);
    }
    
    /**
     * On state exited
     */
    onStateExited() {
        
    }
}

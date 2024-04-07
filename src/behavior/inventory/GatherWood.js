
/**
 * Gather wood
 */
export default class GatherWood {
    constructor(bot, targets = {}, active = false) {
        this.bot = bot;
        this.active = active;
        this.targets = targets;
        this.stateName = "gatherWood";
    }
    
    /**
     * On state entered
     */
    onStateEntered() {
        console.log(`We've got to gather wood!`);
    }
    
    /**
     * On state exited
     */
    onStateExited() {
        console.log(`Wood gather end`);
    }
}

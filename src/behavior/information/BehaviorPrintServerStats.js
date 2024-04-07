/**
 * Example state
 * 
 */
export default class BehaviorPrintServerStats {
    constructor(bot, targets = {}, active = false) {
        this.bot = bot;
        this.active = active;
        this.targets = targets;
        this.stateName = "behaviorPrintServerStats";
    }
    
    /**
     * On state entered
     */
    onStateEntered() {
        console.log(`${this.bot.username} has entered the ${this.stateName} state.`);
    }
    
    /**
     * On state exited
     */
    onStateExited() {
        console.log(`${this.bot.username} has left the ${this.stateName} state.`);
    }
}

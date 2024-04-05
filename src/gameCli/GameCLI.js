import MessagePlayer from "../MessagePlayer.js";

import Minion from '../Minion.js';
import ActionCmd from "./action/ActionCmd.js";
import InventoryCmd from "./inventory/InventoryCmd.js";

/**
 * Game cli
 * 
 * In-game cli with commands and stuff
 */
export default class GameCLI {
    debug = false;
    
    /**
     * 
     * @param {*} bot Bot
     * @param {Minion} minion Minion class
     */
    constructor(bot, minion) {
        this.minion = minion;
        this.bot = bot;
        
        // --- Commands ---
        // The user sends a command to the bot, only if the name is mine
        bot.on('whisper', (username, message) => {
            // Commander username
            if(username === this.minion.commanderUsername) {
                // Get player
                const player = bot.players[username]?.entity;
                const msgPlayer = new MessagePlayer(bot, username);
                if(!player) {
                    msgPlayer.msg("I can't see you!");
                    return;
                }
                
                // Commands
                // Case insensitive
                const msg = message.toLowerCase();
                
                // Get args
                // Split by spaces
                const args = msg.split(" ");
                
                // Args for the next command in chain
                const nextArgs = args.filter((item, index) => index > 0);
                
                const cmd = args[0];
                if(cmd === "action") {
                    const action = new ActionCmd(bot, msgPlayer, nextArgs);
                } else if(cmd === "come") {
                    msgPlayer.setOk().msg("Going towards the player");
                    
                    this.minion.goToPlayer(player);
                } else if(cmd === "dh" || cmd === "dHealth" || cmd === "displayHealth") {
                    const remaining = bot.health;
                    
                    const health = this.displayRemainingStat(remaining);
                    
                    msgPlayer.setOk().msg(`My Health is: [${health}](${remaining.toPrecision(2)})`);
                } else if(cmd === "dhun" || cmd === "displayHunger") {
                    const remaining = bot.food;
                    
                    const hunger = this.displayRemainingStat(remaining);
                    
                    msgPlayer.setOk().msg(`My Hunger is: [${hunger}](${remaining.toPrecision(2)})`);
                } else if(cmd === "follow") {
                    // Enable the first bit
                    this.minion.toggleFollowPlayer();
                    
                    let msg = "";
                    if(this.minion.followsPlayer()) {
                        msg = "is following the player.";
                    } else {
                        msg = "has stopped following the player.";
                    }
                    msgPlayer.setOk().msg(`'${this.bot.username}' ${msg}`);
                } else if(cmd === "go") {
                    // Go do something
                    // Go to direction
                } else if(cmd === "help") {
                    // Show commands by page
                } else if(cmd === "inv") {
                    const inv = new InventoryCmd(bot, msgPlayer, nextArgs);
                } else if(cmd === "list") {
                    const arg = args[1];
                    if(arg === "items") {
                        // List items
                        const items = this.bot.inventory.items();
                        const output = items
                            .map((item) => `${item.displayName}(${item.count})`)
                            .join(', ');
                        const out = `[${output}]`;
                        msgPlayer.setOk().msg(out);
                    }
                } else if(cmd.startsWith("setRole")) {
                    // Set role
                    // E.g: Lumberjack, Miner, Reconnaissance / Probing, Protect, Attack
                } else if(cmd.startsWith("stop")) {
                    const arg = args[1];
                    if(arg === "follow") {
                        // Stop following the player
                    }
                } else if(cmd.startsWith("guard")) {
                    // Guard an area, attack anything that comes in
                    
                    // Remember to go back to the starting point
                } else {
                    msgPlayer.msg("Command not found!");
                }
            }
        });
    }
    
    /**
     * Nice chat view of a stat
     * 
     * For Hunger or Health only
     * 
     * @param {*} current 
     * @param {*} total 
     * @returns 
     */
    displayRemainingStat(current, total = 20) {
        let res = "";
        for(let i = 0; i < current; i++) {
            // If not even, is half hearth
            res += "X"
        }
        if(current < total) {
            const remaining = Math.floor(total - current);
            for(let i = 0; i < remaining; i++) {
                res += "-";
            }
        }
        
        return res;
    }
}

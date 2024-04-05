// Consider mineflayer a 'bridge'
// My library hast to be singular compared to the many 'bridges'
// This is a concept I often fail to realize
import mineflayer from "mineflayer";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";
import Pathfinder, { pathfinder, Movements } from 'mineflayer-pathfinder';
import { plugin as AutoEat } from "mineflayer-auto-eat";

import MessagePlayer from "./MessagePlayer.js";

const { GoalNear } = Pathfinder.goals;

import { bit_toggle, bit_test } from "./bit.js";

/**
 * Very high level api
 * 
 * Features:
 * - Go to player
 */
export default class Bot {
    // Timers
    followPlayerTimerFlag = null;
    
    commanderUsername = "";
    debug = true;
    actions = 0;
    
    /**
     * 
     * @param {string} commanderUsername My username, or of the player that has permissions to send commands
     */
    constructor(commanderUsername) {
        this.commanderUsername = commanderUsername;
        
        const bot = mineflayer.createBot({
            host: "localhost",
            // Jimmy likes carpentry
            // And chop trees
            username: "j1mmy_32_x",
            // We entering 'offline' servers
            auth: "offline",
            port: 25565,              // set if you need a port that isn't 25565
            version: "1.20.4",           // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
            // password: '12345678'      // set if you want to use password-based auth (may be unreliable). If specified, the `username` must be an email
        });
        
        /**
         * This reads every chat message
         */
        bot.on('chat', (username, message) => {
            // The bot is speaking to... himself???
            if(username === bot.username) {
                return;
            }
            
            // Resend the same message
            bot.chat(message);
        });
        
        // Log errors and kick reasons:
        bot.on('kicked', console.log);
        bot.on('error', console.log);
        
        // Plugins
        bot.loadPlugin(pathfinder);
        bot.loadPlugin(AutoEat);
        
        // View player on the browser
        bot.once('spawn', () => {
            // Autoeat options
            bot.autoEat.options = {
                priority: 'foodPoints',
                startAt: 14,
                bannedFood: [],
            };
            
            // Port is the minecraft server port
            mineflayerViewer(bot, { port: 8001, firstPerson: true });
        });
        
        bot.on('health', () => {
            // Autoeat
            if(bot.food === 20) {
                if(this.debug) {
                    console.log(`Player full food`);
                }
                bot.autoEat.disable();
            } else {
                if(this.debug) {
                    console.log(`Player missing some points of food`);
                }
                try {
                    bot.autoEat.enable();
                    // bot.autoEat.eat(true);
                } catch(err) {
                    if(this.debug) {
                        console.error(err);
                    }
                }
            }
        });
        
        // When an entity moves
        bot.on('entityMoved', (entity) => {
            // Check if it's the player
            if(entity.type === "player" && entity.username === this.commanderUsername) {
                const player = entity;
                // Check if follow player is activated
                if(this.followPlayer()) {
                    // Big mistake I made
                    // this.throttleFollowPlayer(this.goToPlayer(player, 5));
                    // Correct way
                    // Because the function must be called internally
                    const obj = this;
                    this.throttleFollowPlayer(() => obj.goToPlayer(player, 5), 1000 * 3);
                }
            }
        });
        
        // --- Commands ---
        // The user sends a command to the bot, only if the name is mine
        bot.on('whisper', (username, message) => {
            
            // Commander username
            if(username === this.commanderUsername) {
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
                if(msg.startsWith("come")) {
                    msgPlayer.setOk().msg("Going towards the player");
                    
                    this.goToPlayer(player);
                } else if(msg === "dh" || msg === "dHealth" || msg === "displayHealth") {
                    const remaining = bot.health;
                    
                    const health = this.displayRemainingStat(remaining);
                    
                    msgPlayer.setOk().msg(`My Health is: [${health}](${remaining.toPrecision(2)})`);
                } else if(msg === "dhun" || msg === "displayHunger") {
                    const remaining = bot.food;
                    
                    const hunger = this.displayRemainingStat(remaining);
                    
                    msgPlayer.setOk().msg(`My Hunger is: [${hunger}](${remaining.toPrecision(2)})`);
                } else if(msg === "follow") {
                    // Enable the first bit
                    this.actions = bit_toggle(this.actions, 0);
                    
                    let msg = "";
                    if(bit_test(this.actions, 0)) {
                        msg = "is following the player.";
                    } else {
                        msg = "has stopped following the player.";
                    }
                    msgPlayer.setOk().msg(`'${this.bot.username}' ${msg}`);
                } else if(msg.startsWith("go")) {
                    // Go do something
                    // Go to direction
                } else if(msg.startsWith("help")) {
                    // Show commands by page
                } else if(msg.startsWith("setRole")) {
                    // Set role
                    // E.g: Lumberjack, Miner, Reconnaissance / Probing, Protect, Attack
                } else if(msg.startsWith("stop")) {
                    // Get args
                    const args = msg.split(" ");
                    
                    // Next command
                    const cmd = args[1];
                    if(cmd === "follow") {
                        // Stop following the player
                    }
                } else if(msg.startsWith("guard")) {
                    // Guard an area, attack anything that comes in
                    
                    // Remember to go back to the starting point
                } else {
                    msgPlayer.msg("Command not found!");
                }
            }
        });
                
        this.bot = bot;
    }
    
    /**
     * Is following the player?
     * 
     * @returns 
     */
    followPlayer() {
        return bit_test(this.actions, 0);
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
    
    /**
     * Follow player must be throttled because when the player moves too much, the bot follows slowly.
     * 
     * One of the functions to go to the player is quite slow, but that's fine, we fix it by just throttling.
     * 
     * @param {*} mainFunction 
     * @param {*} delay In ms
     * @returns 
     */
    throttleFollowPlayer(mainFunction, delay = 1000) {
        // If there is no timer currently running
        if (this.followPlayerTimerFlag === null) {
            // Execute the main function
            mainFunction();
            
            // Set a timer to clear the timerFlag after the specified delay
            this.followPlayerTimerFlag = setTimeout(() => {
                // Clear the timerFlag to allow the main function to be executed again
                this.followPlayerTimerFlag = null;
            }, delay);
        }
    }
    
    /**
     * Go to a given player
     */
    goToPlayer(player, range = 1) {
        // Get player position
        const { x: playerX, y: playerY, z: playerZ } = player.position;
        
        // Walk towards the player
        const defaultMove = new Movements(this.bot);
        this.bot.pathfinder.setMovements(defaultMove);
        this.bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, range));
    }
}

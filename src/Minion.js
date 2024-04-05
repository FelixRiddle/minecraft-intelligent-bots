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
import GameCLI from "./gameCli/GameCLI.js";

/**
 * Very high level api
 * 
 * Features:
 * - Go to player
 * - Follow player
 * - Display health and hunger
 */
export default class Minion {
    // Timers
    followPlayerTimerFlag = null;
    
    commanderUsername = "";
    debug = false;
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
            // mineflayerViewer(bot, { port: 8001, firstPerson: true });
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
                if(this.followsPlayer()) {
                    // Big mistake I made
                    // this.throttleFollowPlayer(this.goToPlayer(player, 5));
                    // Correct way
                    // Because the function must be called internally
                    const obj = this;
                    this.throttleFollowPlayer(() => obj.goToPlayer(player, 5), 1000 * 3);
                }
            }
        });
        
        const gameCli = new GameCLI(bot, this);
                
        this.bot = bot;
    }
    
    // --- Follow player ---
    /**
     * Toggle follow the player
     */
    toggleFollowPlayer() {
        // Enable the first bit
        this.actions = bit_toggle(this.actions, 0);
    }
    
    /**
     * Is following the player?
     * 
     * @returns 
     */
    followsPlayer() {
        return bit_test(this.actions, 0);
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

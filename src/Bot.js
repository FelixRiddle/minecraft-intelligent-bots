// Consider mineflayer a 'bridge'
// My library hast to be singular compared to the many 'bridges'
// This is a concept I often fail to realize
import mineflayer from "mineflayer";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";
import Pathfinder, { pathfinder, Movements } from 'mineflayer-pathfinder';

import MessagePlayer from "./MessagePlayer.js";

const { GoalNear } = Pathfinder.goals;

/**
 * Very high level api
 * 
 * Features:
 * - Go to player
 */
export default class Bot {
    commanderUsername = "";
    
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
        
        // Get close to the player
        const RANGE_GOAL = 3;
        bot.loadPlugin(pathfinder);
        // The user sends a command to the bot, only if the name is mine
        bot.on('whisper', (username, message) => {
            if(username === "fr3dericc") {
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
                    
                    // Get player position
                    const { x: playerX, y: playerY, z: playerZ } = player.position;
                    
                    // Walk towards the player
                    const defaultMove = new Movements(bot)
                    bot.pathfinder.setMovements(defaultMove);
                    bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, RANGE_GOAL));
                } else if(msg.startsWith("go")) {
                    // Go do something
                    // Go to direction
                } else if(msg.startsWith("setRole")) {
                    // Set role
                    // E.g: Lumberjack, Miner, Reconnaissance / Probing, Protect, Attack
                } else {
                    msgPlayer.msg("Command not found!");
                }
            }
        });
        
        // View player on the browser
        bot.once('spawn', () => {
            const defaultMove = new Movements(bot);
            
            // Port is the minecraft server port
            mineflayerViewer(bot, { port: 8001, firstPerson: true });
        });
                
        this.bot = bot;
    }
    
    /**
     * 
     */
    goToPlayer() {
        
    }
}

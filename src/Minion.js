// Consider mineflayer a 'bridge'
// My library hast to be singular compared to the many 'bridges'
// This is a concept I often fail to realize
import inventoryViewer from 'mineflayer-web-inventory';
import armorManager from "mineflayer-armor-manager";
import mineflayer from "mineflayer";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";
import Pathfinder, { pathfinder, Movements } from 'mineflayer-pathfinder';
import { plugin as AutoEat } from "mineflayer-auto-eat";
import { plugin as pvp } from "mineflayer-pvp";

import { bit_toggle, bit_test } from "./bit.js";
import GameCLI from "./gameCli/GameCLI.js";
import goTowardsEntity from './operation/movement/goTowardsEntity.js';

const { GoalNear } = Pathfinder.goals;

const ITEM_GATHER_DISTANCE = 10;
const DISTANCE_TO_ATTACK = 6;

/**
 * Attack an entity
 */
function attackEntity(bot, entity) {
    // Face the enemy
    bot.lookAt(entity.position);
    
    // Attack any near target
    // We need a tiny throttle here too
    // When there are many it starts to hit everyone
    // But whether you leave it like this or prevent with 'pvp.target'
    // it will still be not enough for him to survive.
    // TODO: Here we have to 'quit' every enemy, and stay away while hitting them
    // This is really complex, I'll leave it like this for now
    // TODO: Also jump when attacking for extra crit damage
    bot.pvp.attack(entity, true);
}

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
    
    // True when the bot is gathering an item
    gatheringItem = false;
    
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
        
        // --- Web viewers ---
        // Web inventory viewer
        inventoryViewer(bot, {
            port: 8002
        });
            
        // Port is the minecraft server port
        mineflayerViewer(bot, {
            port: 8001
        });
        
        // --- Load Plugins ---
        bot.loadPlugin(pathfinder);
        bot.loadPlugin(AutoEat);
        bot.loadPlugin(armorManager);
        bot.loadPlugin(pvp);
        
        // --- Bot events ---
        // Log errors and kick reasons:
        bot.on('kicked', console.log);
        bot.on('error', console.log);
        
        // Spawn
        bot.once('spawn', () => {
            // Autoeat options
            bot.autoEat.options = {
                priority: 'foodPoints',
                startAt: 14,
                bannedFood: [],
            };
            
            // startStateMachine(this.bot, this);
        });
        
        bot.on('health', async () => {
            if(bot.food === 20) {
                bot.autoEat.disable();
                bot.autoEat.options.startAt = 16;
            } else {
                bot.autoEat.enable();
            }
            
            // If down by three hearths
            if(Math.floor(bot.health) <= 20 - 6) {
                // And food is less than 18
                if(bot.food < 18) {
                    if(this.debug) {
                        console.log(`Has to eat, to recover life`);
                    }
                    // autoeat.eat doesn't work when I call it dunno why
                    // but with auto and changing this does work, so it's fine for me
                    bot.autoEat.options.startAt = 17;
                }
            }
        });
        
        // When an entity moves
        bot.on('entityMoved', (entity) => {
            // WARNING: Phantoms are new mobs and mineflayer is not updated for them yet
            // So to detect phantoms you must use the 'mob' type
            if(entity.type === "hostile") {
                const distance = bot.entity.position.distanceTo(entity.position);
                if(distance < DISTANCE_TO_ATTACK) {
                    
                    if(this.debug) {
                        console.log(`\n--- Near hostile entity ${entity.displayName} ---`);
                        console.log(`Entity name: ${entity.name}`);
                        console.log(`Entity type: `, entity.kind);
                    }
                    
                    // console.log(`Distance to entity: `, distance);
                    
                    attackEntity(bot, entity);
                } else if(distance < 30) {
                    // Skeletons and pillagers can shoot at this distance
                }
                
                // Bear in mind shulkers
                
                // Blazes and ghasts can shoot from two light years away
                // (jk, but they are so fukin annoying because they shoot from really far away)
                
            }
            
            // Check if it's the player
            if(entity.type === "mob") {
                if(this.debug) {
                    console.log(`\n--- Entity ${entity.displayName} ---`);
                    console.log(`Entity name: ${entity.name}`);
                    console.log(`Entity type: `, entity.kind);
                }
                
                // Hostile entity
                if(entity.name === "phantom") {
                    const distance = bot.entity.position.distanceTo(entity.position);
                    if(distance < DISTANCE_TO_ATTACK) {
                        if(this.debug) {
                            console.log(`\n--- Hostile entity ${entity.displayName} ---`);
                            console.log(`Entity name: ${entity.name}`);
                            console.log(`Entity type: `, entity.kind);
                        }
                        
                        attackEntity(bot, entity);
                    }
                }
            } else if(entity.type === "player") {
                // Check if it's a commander
                if(entity.username === this.commanderUsername) {
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
            } else if(entity.type === "object") {
                if(this.debug) {
                    console.log(`--- Object ${entity.displayName} ---`);
                    console.log(`Entity name: ${entity.name}`);
                }
            }
            
            // TODO: Abstract this down to a class
            // The entity type of items is 'UNKNOWN', I think this might change so not gonna use it
            if(entity.name === "item") {
                // Item spawned
                // Go towards it
                const distance = bot.entity.position.distanceTo(entity.position);
                if(distance < ITEM_GATHER_DISTANCE) {
                    // Check if there's no priority action first
                    if(!this.doingPriorityAction() && !this.gatheringItem) {
                        // Gather item
                        if(this.debug) {
                            console.log(`[Detected item nearby] Going to gather it`);
                        }
                        
                        const obj = this;
                        
                        // Face the entity
                        bot.lookAt(entity.position);
                        
                        // Go
                        goTowardsEntity(bot, entity)
                            .then(() => {
                                if(this.debug) {
                                    console.log(`[Item collected]`);
                                }
                                obj.gatheringItem = false;
                            }).catch(err => {
                                console.log(`Couldn't gather item!`);
                            });
                        this.gatheringItem = true;
                    }
                }
            }
        });
        
        const gameCli = new GameCLI(bot, this);
                
        this.bot = bot;
    }
    
    /**
     * Doing an action with priority
     */
    doingPriorityAction() {
        // Attacking
        const attacking = this.bot.pvp.target && true;
        return attacking;
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

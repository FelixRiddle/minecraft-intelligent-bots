import Pathfinder, { Movements } from 'mineflayer-pathfinder';

import blockView, { arrBlockView } from "../../../view/block.js";
import { saplingNameFromBlockName, treeLeaveNames } from "./index.js";
import equipJumpAndPlaceBlock from '../../../operation/actions/equipJumpAndPlace.js';

const { GoalNear } = Pathfinder.goals;

/**
 * Tree class abstraction
 */
export default class Tree {
    debug = false;
    moveTimerFlag = null;
    
    /**
     * Tree constructor
     * 
     * WARNING: Do not create from here unless you know it's the bottom log
     * 
     * @param {*} bottomLogPosition 
     */
    constructor(bot, io, bottomLogPosition) {
        this.bot = bot;
        this.io = io;
        this.position = bottomLogPosition;
    }
    
    /**
     * Detect whole tree from a single block, throws error if it's not a tree
     */
    static fromSingleBlock(bot, io, blockPosition) {
        console.log(`--- Tree position ---`);
        
        if(!Tree.hasTopLeave(bot, blockPosition)) {
            throw Error("Not a tree, because it doesn't have a top leave.");
        }
        
        // The bottom is at least 6
        let currentBlockPosition = blockPosition;
        for(let i = 0; i <= 6; i++) {
            
            // Get a block below
            const newBlock = bot.blockAt(blockPosition.offset(0, -i, 0));
            
            // Check if it's dirt
            if(newBlock.name === "dirt") {
                if(this.debug) {
                    console.log(`\nResult:`);
                    console.log(`First wood loc: `, currentBlockPosition);
                    console.log(`Dirt position: `, newBlock.position);
                }
                return new Tree(bot, io, currentBlockPosition);
            }
            
            // Forgot this one haha
            currentBlockPosition = newBlock.position;
        }
        
        throw Error("Not a tree, because it doesn't have dirt below it.")
    }
    
    /**
     * Check that the top leave exists
     */
    static hasTopLeave(bot, blockPosition) {
        // Check top leave
        for(let i = 0; i <= 8; i++) {
            const newBlock = bot.blockAt(blockPosition.offset(0, i, 0));
            // Gonna narrow it to birch for now
            if(newBlock.name === "birch_leaves") {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Break tree
     */
    async breakTree() {
        // The class has bot inside, and it's too big to print
        if(this.debug) {
            console.log(`Tree: `, this.position);
        }
        
        const treePos = this.position;
        // Walk towards the player
        const defaultMove = new Movements(this.bot);
        await this.bot.pathfinder.setMovements(defaultMove);
        this.bot.pathfinder.setGoal(new GoalNear(treePos.x, treePos.y, treePos.z, 1));
        
        // When the player reaches the tree
        // Execute chop tree
        
        // The player doesn't starts moving immedeately we have to wait a little
        // If I could get more information about pathfinder this wouldn't be necessary
        setTimeout(() => {
            this.onGoalReached(async () => {
                await this.chopTree(this);
        
                // Plant sapling
                this.plantSapling();
            });
        }, 1000);
    }
    
    /**
     * Get sapling name
     */
    saplingName() {
        const blockName = this.treeBlockName();
        const saplingName = saplingNameFromBlockName(blockName);
        return saplingName;
    }
    
    /**
     * Try to plant sapling of the same tree
     */
    plantSapling() {
        try {
            const sapName = this.saplingName();
            equipJumpAndPlaceBlock(this.bot, this.io, sapName);
            console.log(`Sapling planted`);
            this.io.ok("Sapling planted");
        } catch(err) {
            const msg = `[Tree object]: Couldn't plant the sapling due to: ${err}`;
            console.error(msg);
            this.io.error(msg);
        }
    }
    
    /**
     * Get the block name of the tree
     * 
     * Block name as in log block name
     */
    treeBlockName() {
        return this.bot.blockAt(this.position).name;
    }
    
    /**
     * Get tree logs
     * 
     * It starts from the bottom, uses the leaf at the top as a stop
     * 
     * I need relative height, because when I tell the bot to go to a place he automatically removes two logs
     */
    treeLogs(fromRelativeHeight = 0) {
        // Check top leave
        let treeLogs = [];
        let foundLeaves = false;
        for(let i = fromRelativeHeight; i <= 9 - fromRelativeHeight; i++) {
            if(this.debug) {
                console.log(`\n--- Iteration ${i} ---`);
            }
            
            const block = this.bot.blockAt(this.position.offset(0, i, 0));
            
            if(this.debug) {
                console.log(`Current log: `, blockView(block));
            }
            
            // Find the last leave
            const isLeave = (treeLeaveNames.indexOf(block.name) > -1) && true;
            if(isLeave) {
                foundLeaves = true;
                break;
            }
            
            treeLogs.push(block);
        }
        
        if(!foundLeaves) {
            throw Error("This is not a tree!");
        }
        
        return treeLogs;
    }
    
    /**
     * Await to reach goal, checks each second
     * 
     * @param {*} mainFunction 
     * @param {*} delay 
     */
    onGoalReached(mainFunction, delay = 500) {
        // If there is no timer currently running
        const moving = this.bot.pathfinder.isMoving();
        if(!moving) {
            // Execute the main function
            return mainFunction();
        } else {
            // Set a timer to clear the timerFlag after the specified delay
            this.moveTimerFlag = setTimeout(() => {
                // Run this function again until the goal is reached.
                this.moveTimerFlag = this.onGoalReached(mainFunction, delay);
            }, delay);
        }
    }
    
    /**
     * Chop tree
     */
    async chopTree(obj) {
        // Chop tree down
        try {
            const logs = obj.treeLogs();
            
            if(obj.debug) {
                console.log(`--- Chopping tree ---`);
                console.log(`Logs: `, arrBlockView(logs));
            }
            
            for(const log of logs) {
                if(obj.debug) {
                    console.log(`Current log: `, blockView(log));
                }
                
                if (obj.bot.canDigBlock(log)) {
                    try {
                        await obj.bot.dig(log);
                    } catch (err) {
                        console.log(err.stack);
                    }
                } else {
                    obj.io.error('Cannot dig');
                }
            };
            
            obj.io.ok("Tree down");
        } catch(err) {
            console.error(err);
        }
    }
}


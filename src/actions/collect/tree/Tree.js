import blockView from "../../../view/block.js";
import { treeLeaveNames } from "./index.js";

/**
 * Tree class abstraction
 */
export default class Tree {
    
    /**
     * Tree constructor
     * 
     * WARNING: Do not create from here unless you know it's the bottom log
     * 
     * @param {*} bottomLogPosition 
     */
    constructor(bot, bottomLogPosition) {
        this.bot = bot;
        this.position = bottomLogPosition;
    }
    
    /**
     * Detect whole tree from a single block, throws error if it's not a tree
     */
    static fromSingleBlock(bot, blockPosition) {
        console.log(`--- Tree position ---`);
        
        if(!Tree.hasTopLeave(bot, blockPosition)) {
            throw Error("Not a tree, because it doesn't have a top leave.");
        }
        
        // The bottom is at least 6
        let currentBlockPosition = blockPosition;
        for(let i = 0; i <= 6; i++) {
            
            // Get a block below
            const newBlock = bot.blockAt(blockPosition.offset(0, -i, 0));
            if(this.debug) {
                console.log(`Current block: ${newBlock.position}(${newBlock.name})`);
            }
            
            // Check if it's dirt
            if(newBlock.name === "dirt") {
                if(this.debug) {
                    console.log(`\nResult:`);
                    console.log(`First wood loc: `, currentBlockPosition);
                    console.log(`Dirt position: `, newBlock.position);
                }
                return new Tree(bot, currentBlockPosition);
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
}


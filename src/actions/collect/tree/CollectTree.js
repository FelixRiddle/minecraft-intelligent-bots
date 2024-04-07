import { getLogBlocks } from '../../../registry/block/logBlock.js';
import Tree from './Tree.js';

/**
 * Non-destructive way to collect trees
 * 
 * Actions:
 * 1) Bot looks and finds a tree
 * 2) Go to tree
 * 3) Chop tree
 * 4) Plant sapling on the same spot(This is the non-destructive part)
 */
export default class CollectTree {
    debug = false;
    
    constructor(bot, io) {
        this.bot = bot;
        this.io = io;
        
        this.collectAndPlantTree();
    }
    
    /**
     * Collect and plant tree
     */
    collectAndPlantTree() {
        const trees = this.findTrees();
        const tree = trees[0];
        
        if(!tree) {
            const msg = "Couldn't find a tree nearby!";
            console.error(msg);
            this.io.error(msg);
        } else {
            // Break tree
            tree.breakTree();
        }
    }
    
    /**
     * Find tree
     * 
     * This is like a tree radar, I think it should be split into its own class.
     */
    findTrees() {
        const stageName = "[Find trees]";
        
        // Get the correct block type
        const treeBlocks = getLogBlocks(this.bot, this.io);
        const treeBlocksId = treeBlocks.map((block) => block.id);
        if(this.debug) {
            console.log(`\n${stageName}[Stage 1] Get tree block names and their ids`);
            console.log(`Tree block names: `, treeBlocks);
            console.log(`Tree block ids: `, treeBlocksId);
        }
        
        // Find blocks nearby
        const treeLogPositions = this.bot.findBlocks({
            // Only birch tree
            matching: treeBlocksId,
            // Defaults to 16
            maxDistance: 32,
            // How many to find before returning
            // Defaults to 1
            count: 16,
        });
        if(this.debug) {
            console.log(`\n${stageName}[Stage 2] Get log blocks nearby`);
            console.log(`Tree logs position: `, treeLogPositions);
        }
        
        // List trees only
        // And remove duplicates
        let treesFoundNearby = [];
        for(const blockPosition of treeLogPositions) {
            // The problem with this big try catch, is that it may hide important errors
            try {
                // Get tree
                const tree = this.tree(blockPosition);
                
                if(tree) {
                    // Detect duplicates
                    const duplicate = treesFoundNearby.find(
                        (item) => item.position.equals(item.position, tree.position)
                    );
                    const isDuplicated = duplicate && true;
                    
                    if(this.debug) {
                        console.log(`Found tree: `, tree);
                        console.log(`Is duplicated?: `, isDuplicated);
                    }
                    
                    // Check if we already have it
                    if(!isDuplicated) {
                        treesFoundNearby.push(tree);
                    }
                }
            } catch(err) {
                // Not a tree
                console.error(`Error: `, err);
            }
        }
        
        if(this.debug) {
            console.log(`${stageName}[Stage 3] Validate trees and filter out duplicates`);
            this.printTreeList(treesFoundNearby);
        }
        
        return treesFoundNearby;
    }
    
    /**
     * Print tree list
     */
    printTreeList(trees) {
        // Print all
        console.log(`[`);
        trees.map((tree) => {
            console.log(`${tree.consoleView()}\n`);
        });
        console.log(`]`);
    }
    
    /**
     * Get tree position from the ground
     * 
     * Trows error if it's not a tree
     */
    treePosition(blockPosition) {
        const tree = this.tree(blockPosition);
        const treePos = tree.position;
        
        if(this.debug) {
            console.log(`Tree: `, tree);
            console.log(`Tree position: `, treePos);
        }
        
        return treePos;
    }
    
    /**
     * Get tree class abstraction from a single block
     * 
     * May throw an error if it's not a tree
     */
    tree(blockPosition) {
        return Tree.fromSingleBlock(this.bot, this.io, blockPosition);
    }
}

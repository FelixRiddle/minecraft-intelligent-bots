import optionOrDefault from "../../lib/option/optionOrDefault.js";
import { getLogBlocks } from "../../registry/block/logBlock.js";
import Tree from "../collect/tree/Tree.js";

/**
 * Tree radar
 * 
 * Pretty much the same as collect tree, except that we don't collect it hehe
 */
export default class TreeRadar {
    debug = false;
    
    constructor(bot, io, options = {
        ioEnabled: true,
        range: 32,
    }) {
        this.bot = bot;
        this.io = io;
        
        // Check values that may have been overrided
        // TODO: This needs unit testing
        options.range = optionOrDefault(options, 'range', 32);
        options.ioEnabled = optionOrDefault(options, 'ioEnabled', true);
        this.options = options;
    }
    
    /**
     * Get trees nearby
     */
    treesNearby() {
        const trees = this.findTrees();
        const tree = trees[0];
        
        if(!tree) {
            const msg = "Couldn't find a tree nearby!";
            console.error(msg);
            
            if(this.options.ioEnabled) {
                this.io.error(msg);
            }
            
            // Throw an error
            throw Error("Couldn't find a tree nearby");
        }
        
        return trees;
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
            maxDistance: this.options.range,
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
                // console.error(`Error: `, err);
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

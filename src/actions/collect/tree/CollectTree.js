import Tree from './Tree.js';
import { treeBlockNames } from './index.js';

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
        
        // It seems like trees actually returns only one for now
        const tree = trees[0];
        
        if(!tree) {
            this.io.error("Couldn't find a tree nearby!");
        } else {
            // Break tree
            tree.breakTree();
        }
    }
    
    /**
     * Find tree
     */
    findTrees() {
        // Get the correct block type
        let treeBlocks = [];
        for(const el of treeBlockNames) {
            const blockType = this.bot.registry.blocksByName[el];
            treeBlocks.push(blockType);
            if (!blockType) {
                this.io.error(`Couldn't find a block, this shouldn't be possible: ${el}.`);
                return;
            }
        }
        const treeBlocksId = treeBlocks.map((block) => block.id);
        
        // This only returns one block??
        const treeLogPositions = this.bot.findBlocks({
            // Only birch tree
            matching: treeBlocksId
        });
        console.log(treeLogPositions);
        
        let treesFoundNearby = [];
        for(const blockPosition of treeLogPositions) {
            try {
                // Get tree
                const tree = this.tree(blockPosition);
                
                if(this.debug) {
                    console.log(`Tree: `, tree);
                }
                
                if(tree) {
                    // Detect duplicates
                    const duplicate = treesFoundNearby.find(
                        (item) => item.position.equals(item.position, tree.position)
                    );
                    const isDuplicated = duplicate && true;
                    
                    if(this.debug) {
                        console.log(`Found tree: `, res);
                    }
                    
                    // Check if we already have it
                    if(!isDuplicated) {
                        treesFoundNearby.push(tree);
                    }
                }
            } catch(err) {
                // Not a tree
            }
        }
        
        return treesFoundNearby;
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

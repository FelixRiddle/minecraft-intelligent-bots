import Pathfinder, { Movements } from 'mineflayer-pathfinder';

import Tree from './Tree.js';

const { GoalNear } = Pathfinder.goals;

/**
 * 
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
        console.log(tree);
        
        // Walk towards the player
        const defaultMove = new Movements(this.bot);
        this.bot.pathfinder.setMovements(defaultMove);
        this.bot.pathfinder.setGoal(new GoalNear(tree.x, tree.y, tree.z, 0));
    }
    
    /**
     * Find tree
     */
    findTrees() {
        // Get the correct block type
        const treeBlockNames = [
            "oak_log",
            "spruce_log",
            "birch_log",
            "jungle_log",
            "acacia_log",
            "dark_oak_log",
            "mangrove_log",
            "cherry_log",
        ];
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
            matching: treeBlocks[2].id
        });
        console.log(treeLogPositions);
        
        let treesFoundNearby = [];
        for(const blockPosition of treeLogPositions) {
            const treePos = this.treePosition(blockPosition);
            
            if(this.debug) {
                console.log(`Tree pos: `, treePos);
            }
            
            if(treePos) {
                const res = treesFoundNearby.find((item) => !item.equals(item, treePos));
                
                if(this.debug) {
                    console.log(`Found tree: `, res);
                }
                
                // If res is undefined
                if(!res) {
                    treesFoundNearby.push(treePos);
                }
            }
        }
        console.log(`Trees found nearby: `, treesFoundNearby);
        
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
        return Tree.fromSingleBlock(this.bot, blockPosition);
    }
    
    /**
     * Break tree
     */
    breakTree() {
        
    }
}

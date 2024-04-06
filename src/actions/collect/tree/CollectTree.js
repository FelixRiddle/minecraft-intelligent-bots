import Pathfinder, { Movements } from 'mineflayer-pathfinder';

import Tree from './Tree.js';
import { treeBlockNames } from './index.js';
import { arrBlockView } from '../../../view/block.js';

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
        
        if(!tree) {
            this.io.error("Couldn't find a tree nearby!");
        } else {
            // The class has bot inside, and it's too big to print
            if(this.debug) {
                console.log(`Tree: `, tree.position);
            }
            
            const treePos = tree.position;
            // Walk towards the player
            const defaultMove = new Movements(this.bot);
            this.bot.pathfinder.setMovements(defaultMove);
            this.bot.pathfinder.setGoal(new GoalNear(treePos.x, treePos.y, treePos.z, 0));
            
            // Chop tree down
            try {
                if(this.debug) {
                    console.log(`--- Finding tree logs ---`);
                }
                const logs = tree.treeLogs(2);
                
                console.log(`Logs: `, arrBlockView(logs));
                
            } catch(err) {
                console.error(err);
            }
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
        // console.log(`Trees found nearby: `, treesFoundNearby);
        
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

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
        
        const treeLogPositions = this.bot.findBlocks({
            matching: treeBlocksId
        });
        console.log(treeLogPositions);
        
        let treesFoundNearby = [];
        for(const blockPosition of treeLogPositions) {
            const treePos = this.treePosition(blockPosition);
            if(treePos) {
                const res = treesFoundNearby.find((item) => !item.equals(item, treePos));
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
     * Is a whole tree
     * Under it there must be dirt, above it there must be no more than seven blocks of wood
     * Also find at least some leaves around
     */
    isWholeTree(blockPosition) {
        let res = false;
        try {
            // Get tree position from the ground
            this.treePosition(blockPosition);
            res = true;
        } catch(err) {
            console.error(err);
        }
        
        return res;
    }
    
    /**
     * Check that the top leave exists
     */
    hasTopLeave(blockPosition) {
        // Check top leave
        for(let i = 0; i <= 8; i++) {
            const newBlock = this.bot.blockAt(blockPosition.offset(0, i, 0));
            // Gonna narrow it to birch for now
            if(newBlock.name === "birch_leaves") {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Get tree position from the ground
     * 
     * Trows error if it's not a tree
     */
    treePosition(blockPosition) {
        if(!this.hasTopLeave(blockPosition)) {
            throw Error("Not a tree, because it doesn't have a top leave.");
        }
        
        // The bottom is at least 6
        let currentBlockPosition = blockPosition;
        for(let i = 0; i <= 6; i++) {
            
            // Get a block below
            const newBlock = this.bot.blockAt(blockPosition.offset(0, -i, 0));
            
            // Check if it's dirt
            if(newBlock.name === "dirt") {
                return currentBlockPosition;
            }
        }
        
        throw Error("Not a tree, because it doesn't have dirt below it.")
    }
    
    /**
     * Break tree
     */
    breakTree() {
        
    }
}

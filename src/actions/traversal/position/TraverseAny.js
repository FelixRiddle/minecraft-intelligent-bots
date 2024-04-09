import vec3 from "vec3";

import optionOrDefault from "../../../lib/option/optionOrDefault.js";

/**
 * Class aimed at providing unobstructed traversal detection
 * 
 * Direction x or z is normalized internally
 * 
 * Features:
 * - Traverse in any direction
 * Can also go diagonally
 * Uses mineflayer pathfinder
 * 
 * - Get block at the correct height
 * When checking for height get the highest block or the lowest block
 */
export default class TraverseAny {
    constructor(bot, io, options = {
        range: 32,
        maxHeight: 10,
        directionX: 1,
        directionZ: 0,
    }) {
        this.bot = bot;
        this.io = io;
        
        if(options.directionX >= 1) {
            options.directionX = 1;
        }
        if(options.directionX <= -1) {
            options.directionX = -1
        }
        
        if(options.directionZ >= 1) {
            options.directionZ = 1;
        }
        if(options.directionZ <= -1) {
            options.directionZ = -1
        }
        
        options.range = optionOrDefault(options, 'range', 32);
        options.maxHeight = optionOrDefault(options, 'maxHeight', 10);
        options.directionX = optionOrDefault(options, 'directionX', 1);
        options.directionZ = optionOrDefault(options, 'directionZ', 0);
        
        this.options = options;
    }
    
    /**
     * Checks for a surface block at an optimal height
     */
    getOptimalSurfaceBlock(block, blockName = "air") {
        const pos = block.position;
        
        // If the block is air go down
        let lastBlock = block;
        if(block.name === blockName) {
            // Here we're in the air, and we're looking for a solid block
            console.log(`Looking for a ground block`);
            
            // Use negative max height
            for(let i = 0; i < -this.options.maxHeight; i++) {
                const block = this.bot.blockAt(vec3(pos.x, pos.y + i, pos.z));
                
                // We've got to the the exact opposite
                // Check for air blocks until we get one that's not air
                // Check if it's NOT the block
                if(!(block.name === blockName)) {
                    console.log(`Ground block found: `, block);
                    
                    // Return
                    return lastBlock;
                }
                
                lastBlock = block;
            }
        } else {
            // Here we're looking for an air block
            console.log(`Looking for air block`);
            
            // Use max height
            for(let i = 0; i < this.options.maxHeight; i++) {
                const block = this.bot.blockAt(vec3(pos.x, pos.y + i, pos.z));
                
                // Check if it's the block
                if(block.name === blockName) {
                    console.log(`Air block found: `, block);
                    
                    // Return
                    return block;
                }
                
                lastBlock = block;
            }
        }
        
        // Block not found
        return undefined;
    }
    
    /**
     * Traversable block ahead in any direction
     */
    traversableBlock() {
        // Get to ground
        const entityPos = this.bot.entity.position;
        
        // Get block below
        const blockBelow = this.bot.blockAt(vec3(entityPos.x, entityPos.y - 1, entityPos.z));
        
        // Check if it's air or a normal block
        if(blockBelow.name === "air") {
            // The player is falling?
            // Nope
            throw Error("Player(bot) is falling");
        } else if(blockBelow.name === "cave_air" || blockBelow.name === "void_air") {
            throw Error("Not in surface");
        } else {
            // Ok
        }
        
        // We need the previous block
        let previousBlock = blockBelow;
        // console.log(`Previous block set to block below: `, previousBlock);
        
        for(let i = 0; i <= this.options.range; i++) {
            const prevPos = previousBlock.position;
            
            // Block ahead
            // The position of the new block is stored, so don't use 'i' here!
            const block = this.bot.blockAt(
                vec3(
                    prevPos.x + this.options.directionX,
                    prevPos.y,
                    prevPos.z + this.options.directionZ
                )
            );
            // console.log(`Current block: `, block);
            
            // Validate that there's air above
            const airAbove = this.getOptimalSurfaceBlock(block, 'air');
            
            // If there's no air, we will consider this as untraversable
            if(!airAbove) {
                throw Error("Not traversable");
            }
            
            previousBlock = block;
        }
        
        // The last block is ok
        return previousBlock;
    }    
}

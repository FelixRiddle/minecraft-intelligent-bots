import vec3 from "vec3";

import optionOrDefault from "../../../../../lib/option/optionOrDefault.js";

/**
 * Check blocks above
 * 
 * Check a given block above a position, and if it's not found throw an error
 */
export function blockExistsAbove(bot, block, blockName, options = {
    range: 10
}) {
    options.range = optionOrDefault(options, 'range', 10);
    
    const pos = block.position;
    
    for(const i = 0; i < options.range; i++) {
        const block = bot.blockAt(vec3(pos.x, pos.y + i, pos.z));
        
        // Check if it's the block
        if(block.name === blockName) {
            // Return
            return true;
        }
    }
    
    // Block not found
    return false;
}

/**
 * Traversable block ahead in XDirection(in x direction XD)
 */
export default function traversableBlockAheadXDirection(bot, options = {
    range: 32,
}) {
    options.range = optionOrDefault(options, 'range', 32);
    
    // Get to ground
    const entityPos = bot.entity.position;
    console.log(`Entity pos: `, entityPos);
    
    // Get block below
    const block = bot.blockAt(vec3(entityPos.x, entityPos.y - 1, entityPos.z));
    
    // Check if it's air or a normal block
    if(block.name === "air") {
        // The player is falling?
        // Nope
        throw Error("Player(bot) is falling");
    } else if(block.name === "cave_air" || block.name === "void_air") {
        throw Error("Not in surface");
    } else {
        // Ok
    }
    
    // We need the previous block
    let previousBlock = block;
    for(const i = 0; i <= this.options.range; i++) {
        // Block ahead
        // The position of the new block is stored, so don't use 'i' here!
        const block = bot.blockAt(vec3(previousBlock.x + 1, previousBlock.y, previousBlock.z));
        
        // Validate that there's air above
        const airAbove = blockExistsAbove(bot, block, 'air');
        
        // If there's no air, we will consider this as untraversable
        if(!airAbove) {
            throw Error("Not traversable");
        }
        
        previousBlock = block;
    }
    
    // The last block is ok
    return previousBlock;
}

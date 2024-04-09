import vec3 from "vec3";

import optionOrDefault from "../../../lib/option/optionOrDefault.js";

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
    
    for(let i = 0; i < options.range; i++) {
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
 * 
 * This gives a block ahead of the player in the x direction
 * If the path is obstructed it will throw an error
 * 
 * Doesn't work with water, maybe can be fixed if when you detect that the last block is water
 * instead of stopping there add another 32 blocks, until you reach the end.
 * 
 * But the player(bot) has limited vision so you can't go all the way
 * 
 * This is a stupid algorithm because it has many errors, probably for a low memory consumption bot.
 */
export default function traversableBlockAheadXDirection(bot, options = {
    range: 32,
}) {
    options.range = optionOrDefault(options, 'range', 32);
    
    // Get to ground
    const entityPos = bot.entity.position;
    
    // Get block below
    const blockBelow = bot.blockAt(vec3(entityPos.x, entityPos.y - 1, entityPos.z));
    
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
    
    for(let i = 0; i <= options.range; i++) {
        const prevPos = previousBlock.position;
        
        // Block ahead
        // The position of the new block is stored, so don't use 'i' here!
        const block = bot.blockAt(vec3(prevPos.x + 1, prevPos.y, prevPos.z));
        // console.log(`Current block: `, block);
        
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

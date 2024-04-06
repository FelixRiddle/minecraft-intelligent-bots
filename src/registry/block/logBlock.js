import { treeBlockNames } from "../../actions/collect/tree/index.js";

/**
 * Get log(wood) blocks from bot registry
 * 
 * @returns 
 */
export function getLogBlocks(bot, io) {
    let logBlocks = [];
    for(const el of treeBlockNames) {
        const blockType = bot.registry.blocksByName[el];
        logBlocks.push(blockType);
        if (!blockType) {
            io.error(`Couldn't find a block, this shouldn't be possible: ${el}.`);
            return;
        }
    }
    
    return logBlocks;
}

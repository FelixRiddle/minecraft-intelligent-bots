
// Tree block names
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

/**
 * Get the sapling name of a given block name
 */
export function saplingNameFromBlockName(blockName) {
    console.log(`Block name: ${blockName}`);
    switch(blockName) {
        case "oak_log": {
            return "oak_sapling";
        }
        case "spruce_log": {
            return "spruce_sapling";
        }
        case "birch_log": {
            return "birch_sapling";
        }
        case "jungle_log": {
            return "jungle_sapling";
        }
        default: {
            // Don't want to bother with the rest, not gonna use them for now
            throw Error("saplingNameFromBlockName: Tree block not found, or not implemented!");
        }
    }
}

const treeLeaveNames = [
    'oak_leaves',
    'spruce_leaves',
    'birch_leaves',
    'jungle_leaves',
    'acacia_leaves',
    'dark_oak_leaves',
    'mangrove_leaves',
    'cherry_leaves',
    'azalea_leaves',
    'flowering_azalea_leaves'
];

export {
    treeBlockNames,
    treeLeaveNames,
}

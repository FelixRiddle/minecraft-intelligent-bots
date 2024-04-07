import { treeBlockNames } from "../../actions/collect/tree/index.js";

const woodPlankNames = [
    'oak_planks',
    'spruce_planks',
    'birch_planks',
    'jungle_planks',
    'acacia_planks',
    'dark_oak_planks',
    'mangrove_planks',
    'cherry_planks',
    'bamboo_planks',
    'crimson_planks',
    'warped_planks'
];

/**
 * 
 */
export function itemIsLog(item) {
    for(const name of treeBlockNames) {
        if(name === item.name) {
            return true;
        }
    }
    
    return false;
}

/**
 * Is plank
 */
export function isPlank(item) {
    for(const name of woodPlankNames) {
        if(name === item.name) {
            return true;
        }
    }
    
    return false;
}

export {
    woodPlankNames
}


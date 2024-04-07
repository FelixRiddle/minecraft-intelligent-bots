// Sorting from worst to best
const pickaxeNames = [
    // If you've got this one, rather craft one of stone
    "golden_pickaxe",
    
    "wooden_pickaxe",
    "stone_pickaxe",
    "iron_pickaxe",
    "diamond_pickaxe",
    "netherite_pickaxe",
];

/**
 * Is pickaxe
 * 
 * Check if an item is a pickaxe
 */
export function isPickaxe(item) {
    for(const name of pickaxeNames) {
        if(name === item.name) {
            return true;
        }
    }
    
    return false;
}

/**
 * Is given type
 */
export function isGivenPickaxeType(item, pickaxeType) {
    return item.name === pickaxeType;
}

/**
 * Best pickaxe in list
 * 
 * Given a list of ONLY pickaxes, find the best
 */
export function bestPickaxeInList(pickaxes) {
    const reversed = pickaxeNames.reverse();
    
    // Starting from the best
    for(const pickaxeName of reversed) {
        
        // On every pickaxe
        for(const pickaxe of pickaxes) {
            
            // Check if they match
            if(isGivenPickaxeType(pickaxe, pickaxeName)) {
                return pickaxe;
            }
        }
    }
    
    // Couldn't find
    return undefined;
}

export {
    pickaxeNames,
}


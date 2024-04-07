import { isPlank } from "../../../inventory/wood/index.js";

/**
 * Check if the player has wood planks in the inventory
 * 
 * Planks required is how much wood is required to count as true, the default is 32.
 */
export function hasPlanksQuantity(bot, planksRequired = 32) {
    const inv = bot.inventory;
    console.log(`Inventory: `, inv.items());
    
    for(const item in inv.items()) {
        if(isPlank(item)) {
            if(item.count >= planksRequired) {
                return true;
            }
        }
    }
    
    return false;
}

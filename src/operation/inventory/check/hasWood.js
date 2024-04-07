
/**
 * Check if the player has wood logs in the inventory
 * 
 * Planks required is how much wood is required to count as true, the default is 32.
 */
export function hasWoodQuantity(bot, woodLogsRequired = 8) {
    const inv = bot.inventory;
    console.log(`Inventory: `, inv.items());
    
    for(const item in inv.items()) {
        if(isLog(item)) {
            if(item.count >= woodLogsRequired) {
                return true;
            }
        }
    }
    
    return false;
}

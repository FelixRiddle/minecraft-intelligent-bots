import { bestPickaxeInList, isPickaxe } from "../../../inventory/pickaxes/index.js";

/**
 * Get best pickaxe in inventory
 * 
 * If there's none, return undefined
 * 
 * @param {*} bot 
 */
export default function getBestPickaxe(bot) {
    const inv = bot.inventory;
    
    let pickaxeList = [];
    for(const item in inv.items()) {
        if(isPickaxe(item)) {
            pickaxeList.push(item);
        }
    }
    
    const bestPickaxe = bestPickaxeInList(pickaxeList);
    
    return bestPickaxe;
}


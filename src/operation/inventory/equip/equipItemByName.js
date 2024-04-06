
/**
 * Equip an item
 */
export default async function equipItemByName (bot, io, itemName) {
    let itemsByName = undefined;
    if (bot.supportFeature('itemsAreNotBlocks')) {
        itemsByName = 'itemsByName';
    } else if (bot.supportFeature('itemsAreAlsoBlocks')) {
        itemsByName = 'blocksByName';
    }
    
    try {
        await bot.equip(bot.registry[itemsByName][itemName].id, 'hand');
    } catch (err) {
        io.setError().msg(`Unable to equip '${itemName}': ${err.message}`);
    }
}


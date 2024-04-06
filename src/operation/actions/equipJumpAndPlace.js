
/**
 * Equip and jump place on the spot
 */
export default function equipJumpAndPlaceBlock(bot, io, blockName) {
    let itemsByName = undefined;
    if (bot.supportFeature('itemsAreNotBlocks')) {
        itemsByName = 'itemsByName';
    } else if (bot.supportFeature('itemsAreAlsoBlocks')) {
        itemsByName = 'blocksByName';
    }
    
    const blockType = bot.registry[itemsByName][blockName];
    (async () => {
        try {
            await bot.equip(blockType.id, 'hand');
        
            jumpAndPlaceBlock(bot, io);
        } catch (err) {
            io.setError().msg(`Unable to equip block with name '${blockName}': ${err.message}`);
        }
    })();
}

/**
 * Place hand held block down
 */
export function jumpAndPlaceBlock(bot, io) {
    
    // Take as reference block the one below
    const referenceBlock = bot.blockAt(bot.entity.position.offset(0, -1, 0));
    const jumpY = Math.floor(bot.entity.position.y) + 1.0;
    bot.setControlState('jump', true);
    bot.on('move', placeIfHighEnough);
    
    let once = true;
    let tryCount = 0;
    async function placeIfHighEnough () {
        // If the player is high enough to place the block do it
        if (bot.entity.position.y > jumpY) {
            try {
                await bot.placeBlock(referenceBlock, vec3(0, 1, 0));
                bot.setControlState('jump', false);
                bot.removeListener('move', placeIfHighEnough);
                
                if(once) {
                    io.setOk().msg('Placing a block was successful');
                    once = false;
                }
            } catch (err) {
                tryCount++;
                if (tryCount > 10) {
                    io.setError().msg(err.message);
                    bot.setControlState('jump', false);
                    bot.removeListener('move', placeIfHighEnough);
                }
            }
        }
    }
}


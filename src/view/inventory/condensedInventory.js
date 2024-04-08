
/**
 * View condensed inventory on console
 */
export default function condensedInventory(bot) {
    // List items
    const items = bot.inventory.items();
    const output = items
        .map((item) => `${item.displayName}(${item.count})`)
        .join(', ');
    const out = `[${output}]`;
    return out;
}

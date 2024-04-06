
/**
 * Array view
 */
export function arrBlockView(blocks) {
    let res = "[\n";
    for(const block of blocks) {
        res += `\t${block.displayName}${block.position}\n`;
    }
    res += "]";
    
    return res;
}

/**
 * Simple and default block view
 * 
 * - Shows the name
 * - Shows position
 */
export default function blockView(block) {
    // Position already has parenthesis
    return `${block.displayName}${block.position}`;
}

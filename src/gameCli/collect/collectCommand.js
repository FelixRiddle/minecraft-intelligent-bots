import CollectTree from "../../actions/collect/tree/CollectTree.js";

/**
 * Collect commands
 */
export default function collectCommand(bot, io, args) {
    const arg = args[0];
    if(arg) {
        if(arg === "tree") {
            const collectTree = new CollectTree(bot, io);
        } else if(arg === "and") {
            // Collect and do something else
        }
    } else {
        io.error("This command requires arguments!");
    }
}

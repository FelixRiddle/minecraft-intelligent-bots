import findAndCollectTree from "../../actions/find/and/collect/tree.js";

/**
 * Collect commands
 */
export default function findCommand(bot, io, args) {
    const arg = args[0];
    if(arg) {
        // Find and do something else
        if(arg === "and") {
            // I'll go straight to the point for now
            if(args[1] === "collect") {
                if(args[2] === "tree") {
                    // Basically the command said 'Find and collect tree'
                    findAndCollectTree(bot, io);
                }
            }
        }
    } else {
        io.error("This command requires arguments!");
    }
}

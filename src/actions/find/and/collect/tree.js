import MessagePlayer from "../../../../MessagePlayer.js";
import CollectTree from "../../../collect/tree/CollectTree.js";

/**
 * Find and collect a tree
 * 
 * If no tree is found around search and look for one.
 * 
 * What I mean:
 * - Non-destructive way of collecting a tree(collect and replant).
 * - Try to not cheat, what the user(bot) can see is what the user finds.
 * 
 * Integrated state machine.
 * 
 * This creates and uses an internal state machine.
 * 
 * @param {MessagePlayer} io 
 */
export default function findAndCollectTree(bot, io) {
    console.log(`[Received command] Find and collect tree`);
    
    // Execute collect tree
    try {
        const collectTree = new CollectTree(bot, io, {
            ioEnabled: false,
        });
        
        // Tree collected return
        return;
    } catch(err) {
        // Couldn't collect a tree
        // Now we do try to find one
        console.log(`[No tree] Couldn't find a tree, look for one`);
    }
}


import MessagePlayer from "../../../../MessagePlayer.js";
import CollectTree from "../../../collect/tree/CollectTree.js";
import TreeRadar from "../../../radar/TreeRadar.js";

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
    // If it fails here, it's a real fail
    try {
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
        
        // Look for a tree forever
        while(true) {
            try {
                // Move 64 blocks forward
                const treeRadar = new TreeRadar(bot, io, { ioEnabled: false});
                const treesNearby = treeRadar.treesNearby();
                if(treesNearby.length > 0) {
                    // Great a tree
                    // Collect it
                    const collectTree = new CollectTree(bot, io, {
                        ioEnabled: false,
                    });
                    
                    // Tree collected return
                    return;
                }
            } catch(err) {
                
            }
        }
        
    } catch(err) {
        // It would be weird that an error gets to this place, but just in case we handle it now
        const msg = "Couldn't find and collect a tree";
        console.log(`[Error] ${msg}`);
        io.error(msg);
    }
}


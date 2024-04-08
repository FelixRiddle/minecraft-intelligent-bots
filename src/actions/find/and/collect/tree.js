import MessagePlayer from "../../../../MessagePlayer.js";

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
}


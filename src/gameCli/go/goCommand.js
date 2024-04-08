import Pathfinder, { Movements } from 'mineflayer-pathfinder';

import traversableBlockAheadXDirection from "../../actions/traversal/position/traversableBlockAhead.js";

const { GoalNear } = Pathfinder.goals;

/**
 * Go forward command
 */
export default function goCommand(bot, io, args) {
    const arg = args[0];
    
    if(arg === "x") {
        const nextArg = args[1];
        if(!nextArg) {
            // This will give me a block ahead of the player in the x direction
            // If the path is obstructed it will throw an error
            const blockAhead = traversableBlockAheadXDirection(bot);
            
            // Get block position
            const { x, y, z } = blockAhead.position;
            
            // Walk towards the player
            const defaultMove = new Movements(bot);
            bot.pathfinder.setMovements(defaultMove);
            bot.pathfinder.setGoal(new GoalNear(x, y, z, 0));
            
            io.ok("Walked 32 blocks in x direction");
        }
    }
}

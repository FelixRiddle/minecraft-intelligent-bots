import Pathfinder, { Movements } from 'mineflayer-pathfinder';

import traversableBlockAheadXDirection from "../../actions/traversal/position/traversableBlockAhead.js";
import TraverseAny from '../../actions/traversal/position/TraverseAny.js';

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
            // const blockAhead = traversableBlockAheadXDirection(bot);
            const trav = new TraverseAny(bot, io);
            const blockAhead = trav.traversableBlock();
            
            // Get block position
            const { x, y, z } = blockAhead.position;
            
            // Walk towards the player
            const defaultMove = new Movements(bot);
            bot.pathfinder.setMovements(defaultMove);
            bot.pathfinder.setGoal(new GoalNear(x, y, z, 0));
            
            io.ok("Walked 32 blocks in x direction");
        }
    } else if(arg === "-x") {
        const nextArg = args[1];
        if(!nextArg) {
            // Traverse z
            const trav = new TraverseAny(bot, io, { directionX: -1 });
            const blockAhead = trav.traversableBlock();
            
            // Get block position
            const { x, y, z } = blockAhead.position;
            
            // Walk towards the player
            const defaultMove = new Movements(bot);
            bot.pathfinder.setMovements(defaultMove);
            bot.pathfinder.setGoal(new GoalNear(x, y, z, 0));
            
            io.ok("Walked 32 blocks in -x direction");
        }
    } else if(arg === "z") {
        const nextArg = args[1];
        if(!nextArg) {
            // Traverse z
            const trav = new TraverseAny(bot, io, { directionX: 0, directionZ: 1 });
            const blockAhead = trav.traversableBlock();
            
            // Get block position
            const { x, y, z } = blockAhead.position;
            
            // Walk towards the player
            const defaultMove = new Movements(bot);
            bot.pathfinder.setMovements(defaultMove);
            bot.pathfinder.setGoal(new GoalNear(x, y, z, 0));
            
            io.ok("Walked 32 blocks in z direction");
        }
    } else if(arg === "xz") {
        const nextArg = args[1];
        if(!nextArg) {
            // Traverse z
            const trav = new TraverseAny(bot, io, { directionX: 1, directionZ: 1 });
            const blockAhead = trav.traversableBlock();
            
            // Get block position
            const { x, y, z } = blockAhead.position;
            
            // Walk towards the player
            const defaultMove = new Movements(bot);
            bot.pathfinder.setMovements(defaultMove);
            bot.pathfinder.setGoal(new GoalNear(x, y, z, 0));
            
            io.ok("Walked 32 blocks in xz direction");
        }
    } else if(arg === "-xz") {
        const nextArg = args[1];
        if(!nextArg) {
            // Traverse z
            const trav = new TraverseAny(bot, io, { directionX: -1, directionZ: -1 });
            const blockAhead = trav.traversableBlock();
            
            // Get block position
            const { x, y, z } = blockAhead.position;
            
            // Walk towards the player
            const defaultMove = new Movements(bot);
            bot.pathfinder.setMovements(defaultMove);
            bot.pathfinder.setGoal(new GoalNear(x, y, z, 0));
            
            io.ok("Walked 32 blocks in xz direction");
        }
    }
}

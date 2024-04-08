import traversableBlockAheadXDirection from "../../actions/radar/groundLevel/surface/position/traversableBlockAhead.js";

/**
 * Go forward command
 */
export default function goCommand(bot, io, args) {
    const arg = args[0];
    
    if(arg === "x") {
        const nextArg = args[1];
        if(!nextArg) {
            traversableBlockAheadXDirection(bot)
            io.ok("Walked 32 blocks in x direction");
        }
    }
}

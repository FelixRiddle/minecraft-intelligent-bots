import { BehaviorIdle, NestedStateMachine, StateTransition } from "mineflayer-statemachine";
import GatherWood from "../../behavior/inventory/GatherWood.js";
import CheckWoodenToolsRequirement from "../../behavior/ages/woodAge/CheckWoodenToolsRequirement.js";
import hasEnoughWoodForAllTools from "../../inventory/wood/tools/hasEnoughWoodForAllTools.js";

/**
 * Gather wood arc
 */
export default function gatherWood(bot, targets = {}, quantity = 8) {
    const idleState = new BehaviorIdle(bot);
    const gatherWood = new GatherWood(bot, targets, quantity);
    const woodRequired = new CheckWoodenToolsRequirement(bot, targets);
    
    const stateName = '[Gather wood arc] ';
    
    // Wood age transitions
    const gatherWoodArcTransitions = [
        // Check wood quantity
        // Called if the bot has enough wood
        new StateTransition({
            parent: gatherWood,
            // Craft tools
            child: woodRequired,
            name: 'gatherWood(1)',
            // Transition
            // For the transition check if the bot has enough wood
            shouldTransition: () => {
                const ok = hasEnoughWoodForAllTools(bot);
                return ok;
            },
            onTransition: () => console.log(`${stateName}Check wood`),
        }),
        // Called if the bot doesn't have enough wood for the tools
        // No wood, go find wood
        new StateTransition({
            parent: woodRequired,
            // Go back?
            child: idleState,
            name: 'checkWood',
            // Check if we've got enough
            shouldTransition: () => targets.canCraftWoodenTools,
            onTransition: () => console.log(`${stateName}Enough wood`),
        }),
        // // Go forward 32 blocks
        // new StateTransition({
            
        // }),
        // Called if the bot doesn't have enough wood for the tools
        // No wood, go find wood
        new StateTransition({
            parent: woodRequired,
            // Loop
            child: gatherWood,
            name: 'notEnoughWood',
            // Check if we've got enough
            shouldTransition: () => true,
            onTransition: () => console.log(`${stateName}Gather wood`),
        }),
    ];
    
    // Exit on wood required
    const gatherWoodArcLayer = new NestedStateMachine(gatherWoodArcTransitions, gatherWood, woodRequired);
    
    return gatherWoodArcLayer;
}

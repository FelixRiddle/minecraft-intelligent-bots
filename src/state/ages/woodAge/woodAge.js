import { BehaviorIdle, NestedStateMachine, StateTransition } from "mineflayer-statemachine";

import CheckWoodenToolsRequirement from "../../../behavior/ages/woodAge/CheckWoodenToolsRequirement.js";
import gatherWood from "../../gather/gatherWood.js";

/**
 * Wood age stages
 */
export default function woodAgeStates(bot, targets = {}) {
    
    const idleState = new BehaviorIdle(bot);
    const woodRequired = new CheckWoodenToolsRequirement(bot, targets);
    
    // Forgot to call this bad boy 😡😡😡😡
    const gatherWoodArc = gatherWood(bot, targets, 5);
    
    const stateName = '[Wood age arc] ';
    
    // Wood age transitions
    const woodAgeArcTransitions = [
        // I actually forgot how things were executed
        // new StateTransition({ // Called if the bot has a steak
        //     parent: tryToEat,
        //     child: eatSteak,
        //     shouldTransition: () => bot.hasSteak(),
        // }),
        // new StateTransition({ // Called if the bot has a fish, but no steak
        //     parent: tryToEat,
        //     child: eatFish,
        //     shouldTransition: () => bot.hasFish(),
        // }),
        // new StateTransition({ // Called if the bot doesn't have a steak or a fish
        //     parent: tryToEat,
        //     child: findFood,
        //     shouldTransition: () => true,
        // }),
        
        // Check wood quantity
        // Called if the bot has enough wood
        new StateTransition({
            parent: woodRequired,
            // Craft tools
            child: idleState,
            name: 'checkWoodRequiredToCraftTools',
            // Transition
            shouldTransition: () => targets.canCraftWoodenTools,
            onTransition: () => console.log(`${stateName}Craft tools`),
        }),
        // Called if the bot doesn't have enough wood for the tools
        // No wood, go find wood
        new StateTransition({
            parent: woodRequired,
            child: gatherWoodArc,
            name: 'gatherWoodArc',
            // Check if we've got enough
            shouldTransition: () => true,
            onTransition: () => console.log(`${stateName}Gather wood`),
        })
    ];
    const craftPickaxeLayer = new NestedStateMachine(woodAgeArcTransitions, woodRequired);
    
    return craftPickaxeLayer;
}


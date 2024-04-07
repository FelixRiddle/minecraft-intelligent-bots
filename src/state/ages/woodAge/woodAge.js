import { BehaviorIdle, NestedStateMachine, StateTransition } from "mineflayer-statemachine";

import GatherWood from "../../../behavior/inventory/GatherWood.js";
import PickaxeTier from "../../../behavior/inventory/PickaxeTier.js";
import CheckWoodenToolsRequirement from "../../../behavior/ages/woodAge/CheckWoodenToolsRequirement.js";

/**
 * Wood age stages
 */
export default function woodAgeStates(bot, targets = {}) {
    
    const idleState = new BehaviorIdle(bot);
    const gatherWood = new GatherWood(bot, targets);
    const woodRequired = new CheckWoodenToolsRequirement(bot, targets);
    const pickaxeTier = new PickaxeTier(bot, targets);
    
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
            child: gatherWood,
            name: 'gatherWood',
            // Check if we've got enough
            shouldTransition: () => true,
            onTransition: () => console.log(`${stateName}Gather wood`),
        })
    ];
    const craftPickaxeLayer = new NestedStateMachine(woodAgeArcTransitions, woodRequired);
    
    return craftPickaxeLayer;
}


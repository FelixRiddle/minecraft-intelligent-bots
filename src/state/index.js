import { BehaviorIdle, BehaviorPrintServerStats, BotStateMachine, NestedStateMachine, StateMachineWebserver, StateTransition } from "mineflayer-statemachine";
import GatherWood from "../behavior/inventory/GatherWood.js";
import PickaxeTier from "../behavior/inventory/PickaxeTier.js";
import woodAgeStates from "./ages/woodAge/woodAge.js";

/**
 * Start state machine
 */
export default function startStateMachine(bot) {
    const targets = {};
    
    // --- State machine ---
    const idleState = new BehaviorIdle(bot);
    const printServerStats = new BehaviorPrintServerStats(bot);
    const pickaxeTier = new PickaxeTier(bot, targets);
    
    const woodAge = woodAgeStates(bot, targets);
    
    const startTransitionsLabel = "[Start] ";
    const onStartTransitions = [
        new StateTransition({
            parent: printServerStats, // The state to move from
            child: idleState, // The state to move to
            name: 'startStateMachine', // Optional. Used for debugging
            shouldTransition: () => true, // Optional, called each tick to determine if this transition should occur.
            onTransition: () => console.log(`${startTransitionsLabel}Printing server stats:`), // Optional, called when this transition is run.
        }),
        
        // --- From idle state start trying to fetch things ---
        // --- Pickaxe ---
        // Check pickaxe tier
        new StateTransition({
            parent: idleState,
            child: pickaxeTier,
            name: 'getPickaxeTier',
            shouldTransition: () => true,
            onTransition: () => console.log(`${startTransitionsLabel}Check pickaxe rank`),
        }),
        new StateTransition({
            parent: pickaxeTier,
            child: woodAge,
            name: 'woodAge',
            // If there's no pickaxe start the wood age
            shouldTransition: () => !targets.bestPickaxe,
            onTransition: () => console.log(`${startTransitionsLabel}Wood age layer start`),
        })
    ];
    
    // --- Initialize state machine ---
    // Now we just wrap our transition list in a nested state machine layer. We want the bot
    // to start on the getClosestPlayer state, so we'll specify that here.
    const rootLayer = new NestedStateMachine(onStartTransitions, printServerStats);
    
    // We can start our state machine simply by creating a new instance.
    const stateMachine = new BotStateMachine(bot, rootLayer);
    
    const webserver = new StateMachineWebserver(bot, stateMachine);
    webserver.startServer();
}

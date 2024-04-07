import { BehaviorFollowEntity, BehaviorGetClosestEntity, BehaviorIdle, EntityFilters, NestedStateMachine, StateTransition } from "mineflayer-statemachine";

/**
 * Follow nearest player
 */
export default function followNearestPlayerState(bot) {
    const targets = {};
    const playerFilter = EntityFilters().PlayersOnly;
    
    // Enter and exit states
    const enter = new BehaviorIdle();
    const exit = new BehaviorIdle();
    
    // Follow player
    const followPlayer = new BehaviorFollowEntity(bot, targets);
    const getClosestPlayer = new BehaviorGetClosestEntity(bot, targets, playerFilter);
    
    // Setup transitions
    const followPlayerTransitions = [
        new StateTransition({
            parent: enter,
            child: getClosestPlayer,
            shouldTransition: () => true,
        }),
        
        // Follow player if one is nearby
        new StateTransition({
            parent: getClosestPlayer,
            child: followPlayer,
            shouldTransition: () => targets.entity !== undefined,
        }),
        
        // Don't follow if no one is nearby
        new StateTransition({
            parent: getClosestPlayer,
            child: exit,
            shouldTransition: () => targets.entity === undefined,
        }),
        
        // The bot has reached the target
        new StateTransition({
            parent: followPlayer,
            child: exit,
            shouldTransition: () => followPlayer.distanceToTarget() < 2,
        })
    ];
    
    return new NestedStateMachine(followPlayerTransitions, enter, exit);
}

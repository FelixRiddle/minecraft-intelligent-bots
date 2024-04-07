import Pathfinder, { Movements } from 'mineflayer-pathfinder';

const { GoalNear } = Pathfinder.goals;


/**
 * Go towards an entity
 */
export default async function goTowardsEntity(bot, entity) {
    // Walk towards the player
    const defaultMove = new Movements(bot);
    
    // No building, because it will end up building shi* around my home
    defaultMove.allow1by1towers = false;
    
    const pos = entity.position;
    
    await bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(new GoalNear(pos.x, pos.y, pos.z, 0));
}

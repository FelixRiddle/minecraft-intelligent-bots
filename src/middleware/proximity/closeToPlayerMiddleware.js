/**
 * Check if the bot is close to the player
 */
export default function closeToPlayerMiddleware(bot, io, playerUsername, fn) {
    if(!playerUsername) {
        throw Error("No player username given to 'closeToPlayerMiddleware'");
    }
    
    // Get player
    const player = bot.players[playerUsername]?.entity;
    if(!player) {
        const msg = "The player must be close!";
        io.error(msg);
        throw Error(msg);
    }
    
    // If the user wants to put arguments to this function then do so by
    // wrapping the function like this '() => fn(bot)'
    if(fn) {
        fn();
    }
}

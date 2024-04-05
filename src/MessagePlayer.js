/**
 * Class to send command messages back and forth to the player
 */
export default class MessagePlayer {
    constructor(bot, username) {
        this.bot = bot;
        this.status = "[Error]";
        this.username = username;
    }
    
    /**
     * 
     */
    setError() {
        this.status = "[Error]";
        return this;
    }
    
    /**
     * 
     */
    setOk() {
        this.status = "[Ok]";
        return this;
    }
    
    /**
     * Send message to the user
     * 
     * @param {*} msg 
     */
    msg(msg) {
        this.bot.whisper(this.username, `${this.status} ${msg}`);
        return this;
    }
}


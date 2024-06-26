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
     * Message an error
     * 
     * @param {*} msg 
     * @returns 
     */
    error(msg) {
        this.setError();
        this.bot.whisper(this.username, `${this.status} ${msg}`);
        return this;
    }
    
    /**
     * Message an ok
     */
    ok(msg) {
        this.setOk();
        this.bot.whisper(this.username, `${this.status} ${msg}`);
        return this;
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


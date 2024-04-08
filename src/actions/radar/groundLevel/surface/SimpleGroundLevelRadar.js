import optionOrDefault from "../../../../lib/option/optionOrDefault.js";

/**
 * Simple ground level radar
 * 
 * This one cheats because it even sees what's behind the player
 */
export default class SimpleSurfaceGroundLevelRadar {
    debug = false;
    
    constructor(bot, io, options = {
        ioEnabled: true,
        range: 32,
    }) {
        this.bot = bot;
        this.io = io;
        
        // Check values that may have been overrided
        // TODO: This needs unit testing
        options.range = optionOrDefault(options, 'range', 32);
        options.ioEnabled = optionOrDefault(options, 'ioEnabled', true);
        this.options = options;
    }
    
    /**
     * We will get a ground block and go from there
     */
    groundBlocks() {
        
    }
}


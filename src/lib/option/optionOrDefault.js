/**
 * Option or default
 * 
 * If an option is undefined return default
 */
export default function optionOrDefault(options, optionName, optionDefault) {
    // Return option
    return options[optionName] && options[optionName] ||
        // Return default
        typeof(options[optionName]) === 'undefined' && optionDefault;
}

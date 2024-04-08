/**
 * Option or overrided
 * 
 * Return the option, or if it was overrided(has become undefined) return true
 */
export default function optionOrOverrided(options, optionName) {
    return options[optionName] && options[optionName] || typeof(options[optionName]) === 'undefined';
}

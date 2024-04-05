
export function bit_test(num, bit){
    return ((num>>bit) % 2 != 0)
}

export function bit_set(num, bit){
    return num | 1<<bit;
}

export function bit_clear(num, bit){
    return num & ~(1<<bit);
}

export function bit_toggle(num, bit){
    return bit_test(num, bit) ? bit_clear(num, bit) : bit_set(num, bit);
}


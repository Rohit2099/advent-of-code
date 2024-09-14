function gcd(a, b) {
    for (let temp = b; b !== 0; ) {
        b = a % b;
        a = temp;
        temp = b;
    }
    return a;
}

function lcm(a, b) {
    const gcdValue = gcd(a, b);
    return (a * b) / gcdValue;
}

function lcmOfNums(...arr) {
    let lcmOfAllNums = arr[0];
    for (let i = 0; i < arr.length; i++) {
        lcmOfAllNums = lcm(lcmOfAllNums, arr[i]);
    }
    return lcmOfAllNums;
}

function sortAscending(a, b) {
    return a > b ? 1 : -1;
}

module.exports = { lcmOfNums, sortAscending };

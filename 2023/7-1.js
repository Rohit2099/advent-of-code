const fs = require("fs/promises");
const path = require("path");

const input_path = path.join(__dirname, "7.txt");

const STRENGTH_OF_CARDS = [
    "A",
    "K",
    "Q",
    "J",
    "T",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
];

function getKeysFromHand(hand) {
    const handKeys = hand.split("").reduce((acc, val) => {
        acc[val] = acc[val] + 1 || 1;
        return acc;
    }, {});
    return handKeys;
}
const fiveOfAKind = (hand) => {
    const handKeys = getKeysFromHand(hand);
    return Object.keys(handKeys).length === 1;
};

const fourOfAKind = (hand) => {
    const handKeys = getKeysFromHand(hand);
    const keys = Object.keys(handKeys);
    if (keys.length === 2) {
        return handKeys[keys[0]] === 4 || handKeys[keys[1]] === 4;
    } else {
        return false;
    }
};

const threeOfAKind = (hand) => {
    const handKeys = getKeysFromHand(hand);
    const keys = Object.keys(handKeys);
    if (keys.length === 3) {
        return (
            handKeys[keys[0]] === 3 ||
            handKeys[keys[1]] === 3 ||
            handKeys[keys[2]] === 3
        );
    } else {
        return false;
    }
};

const fullHouse = (hand) => {
    const handKeys = getKeysFromHand(hand);
    const keysLength = Object.keys(handKeys).length;
    return keysLength === 2;
};

const twoPair = (hand) => {
    const handKeys = getKeysFromHand(hand);
    const keysLength = Object.keys(handKeys).length;
    return keysLength === 3;
};

const onePair = (hand) => {
    const handKeys = getKeysFromHand(hand);
    return Object.keys(handKeys).length === 4;
};

const highCard = (hand) => {
    const handKeys = getKeysFromHand(hand);
    return Object.keys(handKeys).length === 5;
};

const RANK_PRIORITY = [
    fiveOfAKind,
    fourOfAKind,
    fullHouse,
    threeOfAKind,
    twoPair,
    onePair,
    highCard,
];
const getRankOfHand = (hand) => {
    for (let i = 0; i < RANK_PRIORITY.length; ++i) {
        if (RANK_PRIORITY[i](hand)) {
            return i;
        }
    }
};

const getStrongerHand = (hand1, hand2) => {
    for (let i = 0; i < 5; ++i) {
        if (hand1[i] === hand2[i]) {
            continue;
        }
        return STRENGTH_OF_CARDS.indexOf(hand1[i]) >
            STRENGTH_OF_CARDS.indexOf(hand2[i])
            ? "Hand 2"
            : "Hand 1";
    }
};

function comparatorFn(handAndBids1, handAndBids2) {
    const rank1 = getRankOfHand(handAndBids1[0]);
    const rank2 = getRankOfHand(handAndBids2[0]);

    if (rank1 > rank2) {
        // Hand2 is stronger.
        return -1;
    } else if (rank2 > rank1) {
        // Hand1 is stronger
        return 1;
    } else {
        const strongerHand = getStrongerHand(handAndBids1[0], handAndBids2[0]);
        return strongerHand === "Hand 1" ? 1 : -1;
    }
}

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    const lines = data.split("\n");
    handAndBids = lines
        .filter((line) => {
            return line.length > 0;
        })
        .map((line) => {
            const intVals = line.split(" ");
            intVals[1] = parseInt(intVals[1], 10);
            return intVals;
        });

    handAndBids.sort(comparatorFn);

    const result = handAndBids.reduce((acc, curValue, idx) => {
        return acc + (idx + 1) * curValue[1];
    }, 0);

    fs.writeFile("output_7.txt", JSON.stringify(handAndBids));

    console.log(result);
});

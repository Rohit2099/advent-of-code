import { readFile } from "fs/promises";
import { join } from "path";

const __dirname = import.meta.dirname;
const input_path = join(__dirname, "7.txt");

const STRENGTH_OF_CARDS = [
    "A",
    "K",
    "Q",
    "T",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
    "J",
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
    const keys = Object.keys(handKeys);
    return keys.length === 1 || (keys.length === 2 && keys.includes("J"));
};

const fourOfAKind = (hand) => {
    const handKeys = getKeysFromHand(hand);
    const keys = Object.keys(handKeys);
    if (keys.length === 2) {
        return Object.values(handKeys).includes(4);
    } else if (keys.length === 3) {
        if (handKeys["J"] === 1) {
            return Object.values(handKeys).includes(3);
        } else {
            return handKeys["J"] === 2 || handKeys["J"] === 3;
        }
    } else {
        return false;
    }
};

const threeOfAKind = (hand) => {
    const handKeys = getKeysFromHand(hand);
    const keys = Object.keys(handKeys);
    if (keys.length === 3) {
        return Object.values(handKeys).includes(3);
    } else if (keys.length === 4) {
        return handKeys["J"] === 1 || handKeys["J"] === 2;
    } else {
        return false;
    }
};

const fullHouse = (hand) => {
    const handKeys = getKeysFromHand(hand);
    const keys = Object.keys(handKeys);
    if (keys.length === 2) {
        return true;
    } else if (keys.length === 3) {
        return handKeys["J"] === 1;
    } else {
        return false;
    }
};

const twoPair = (hand) => {
    const handKeys = getKeysFromHand(hand);
    const keys = Object.keys(handKeys);
    return keys.length === 3;
};

const onePair = (hand) => {
    const handKeys = getKeysFromHand(hand);
    const keys = Object.keys(handKeys);
    if (keys.length === 4) {
        return true;
    } else if (keys.length === 5) {
        return handKeys["J"] === 1;
    } else {
        return false;
    }
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

readFile(input_path, { encoding: "utf-8" }).then((data) => {
    const lines = data.split("\n");
    let handAndBids = lines
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

    console.log(result);
});

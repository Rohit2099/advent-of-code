const fs = require("fs/promises");
const path = require("path");

const input_path = path.join(__dirname, "4.txt");

function numberOfMatches(own, winning) {
    let matches = own.filter((val) => {
        return winning.indexOf(val) !== -1;
    });
    return matches.length;
}

function updateCopies(copies, matches, idx) {
    for (
        let start = idx + 1;
        start < copies.length && start < idx + 1 + matches;
        start++
    ) {
        copies[start] += copies[idx];
    }
}

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    lines = data.split("\n").filter((line) => line.length > 0);

    let copies = new Array(lines.length).fill(1);
    lines.forEach((curLine, curIdx) => {
        let [, lotteries] = curLine.match(/^Card\s+\d+:(.*)/);
        let [winning, own] = lotteries.split("|");

        winning = winning
            .trim()
            .split(" ")
            .filter((item) => item.length > 0);
        own = own
            .trim()
            .split(" ")
            .filter((item) => item.length > 0);
        let matches = numberOfMatches(own, winning);
        updateCopies(copies, matches, curIdx);
    });

    let sum = copies.reduce((acc, cur) => acc + cur, 0);
    console.log(sum);
});

const fs = require("fs/promises");
const path = require("path");

const input_path = path.join(__dirname, "4.txt");

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    lines = data.split("\n").filter((line) => line.length > 0);

    let sum = lines.reduce((acc, curLine) => {
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
        let cardValue = own.reduce((cardSum, cur) => {
            if (winning.indexOf(cur) !== -1) {
                return cardSum === null ? 1 : cardSum * 2;
            }
            return cardSum;
        }, null);
        return acc + cardValue;
    }, 0);
    console.log(sum);
});

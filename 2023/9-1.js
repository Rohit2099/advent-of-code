const { lstatSync } = require("fs");
const fs = require("fs/promises");
const path = require("path");

const input_path = path.resolve(__dirname, "9.txt");

function getExtrapolation(history) {
    let oldHistory = history;
    let lastValues = [];
    while (true) {
        if (Math.min(...oldHistory) === 0 && Math.max(...oldHistory) === 0) {
            break;
        }
        let newHistory = [];
        for (let i = 1; i < oldHistory.length; i++) {
            newHistory.push(oldHistory[i] - oldHistory[i - 1]);
        }
        lastValues.push(oldHistory[oldHistory.length - 1]);
        oldHistory = newHistory;
    }

    let nextValue = 0;
    let prevValue = 0;
    for (let i = lastValues.length - 1; i >= 0; i--) {
        nextValue = prevValue + lastValues[i];
        prevValue = nextValue;
    }

    return nextValue;
}

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    let lines = data.trim().split("\n");
    let history = lines.map((line) => {
        return line
            .trim()
            .split(" ")
            .map((val) => parseInt(val, 10));
    });

    let result = history.reduce((acc, curHistory) => {
        return acc + getExtrapolation(curHistory);
    }, 0);

    console.log(result);
});

const fs = require("fs/promises");
const path = require("path");
const { start } = require("repl");

const input_path = path.join(__dirname, "3.txt");

function symbolPresent(idx, curLine, prevLine, nextLine) {
    if (prevLine) {
        if (
            idx - 1 >= 0 &&
            !Number.isInteger(parseInt(prevLine[idx - 1])) &&
            prevLine[idx - 1] !== "."
        ) {
            return true;
        }
        if (
            !Number.isInteger(parseInt(prevLine[idx])) &&
            prevLine[idx] !== "."
        ) {
            return true;
        }
        if (
            idx + 1 < prevLine.length &&
            !Number.isInteger(parseInt(prevLine[idx + 1])) &&
            prevLine[idx + 1] !== "."
        ) {
            return true;
        }
    }
    if (nextLine) {
        if (
            idx - 1 >= 0 &&
            !Number.isInteger(parseInt(nextLine[idx - 1])) &&
            nextLine[idx - 1] !== "."
        ) {
            return true;
        }
        if (
            !Number.isInteger(parseInt(nextLine[idx])) &&
            nextLine[idx] !== "."
        ) {
            return true;
        }
        if (
            idx + 1 < nextLine.length &&
            !Number.isInteger(parseInt(nextLine[idx + 1])) &&
            nextLine[idx + 1] !== "."
        ) {
            return true;
        }
    }
    if (
        idx - 1 >= 0 &&
        !Number.isInteger(parseInt(curLine[idx - 1])) &&
        curLine[idx - 1] !== "."
    ) {
        return true;
    }
    if (!Number.isInteger(parseInt(curLine[idx])) && curLine[idx] !== ".") {
        return true;
    }
    if (
        idx + 1 < curLine.length &&
        !Number.isInteger(parseInt(curLine[idx + 1])) &&
        curLine[idx + 1] !== "."
    ) {
        return true;
    }
    return false;
}

function adjacentToASymbol(lines, line_idx, start_idx, end_idx) {
    let prevLine =
        line_idx - 1 >= 0 && line_idx - 1 < lines.length
            ? lines[line_idx - 1]
            : null;
    let nextLine =
        line_idx + 1 >= 0 && line_idx + 1 < lines.length
            ? lines[line_idx + 1]
            : null;
    for (let i = start_idx; i <= end_idx; i++) {
        if (symbolPresent(i, lines[line_idx], prevLine, nextLine)) {
            return true;
        }
    }
    return false;
}
function getNumber(line, idx) {
    let start_idx = idx;
    let num_str = "";
    while (Number.isInteger(parseInt(line[start_idx]))) {
        num_str += line[start_idx];
        start_idx++;
    }
    return [parseInt(num_str), start_idx - 1];
}

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    const lines = data.split("\n");
    let sum = lines.reduce((acc, cur_line, line_idx) => {
        let start_idx = 0;
        let local_sum = 0;
        while (start_idx < cur_line.length) {
            if (Number.isInteger(parseInt(cur_line[start_idx]))) {
                let [num, end_idx] = getNumber(cur_line, start_idx);
                if (adjacentToASymbol(lines, line_idx, start_idx, end_idx)) {
                    local_sum += num;
                }
                start_idx = end_idx;
            }
            start_idx++;
        }
        return acc + local_sum;
    }, 0);
    console.log(sum);
});

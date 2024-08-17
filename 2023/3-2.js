const fs = require("fs/promises");
const path = require("path");
const { start } = require("repl");

const input_path = path.join(__dirname, "3.txt");

function getNumbersForLine(line, idx) {
    let nums = [];
    if (Number.isInteger(parseInt(line[idx]))) {
        let num = "";
        let start_left = idx;
        let start_right = idx + 1;
        while (
            start_left >= 0 &&
            Number.isInteger(parseInt(line[start_left]))
        ) {
            num = line[start_left] + num;
            start_left--;
        }
        while (
            start_right < line.length &&
            Number.isInteger(parseInt(line[start_right]))
        ) {
            num = num + line[start_right];
            start_right++;
        }
        nums.push(parseInt(num));
    } else {
        if (idx - 1 >= 0 && Number.isInteger(parseInt(line[idx - 1]))) {
            let start = idx - 1;
            let num = "";
            while (start >= 0 && Number.isInteger(parseInt(line[start]))) {
                num = line[start] + num;
                start--;
            }
            nums.push(parseInt(num));
        }
        if (
            idx + 1 < line.length &&
            Number.isInteger(parseInt(line[idx + 1]))
        ) {
            let start = idx + 1;
            let num = "";
            while (
                start < line.length &&
                Number.isInteger(parseInt(line[start]))
            ) {
                num = num + line[start];
                start++;
            }
            nums.push(parseInt(num));
        }
    }
    return nums;
}

function getAdjacentNumbers(curLine, prevLine, nextLine, start_idx) {
    let nums = [];
    if (prevLine) {
        nums.push(...getNumbersForLine(prevLine, start_idx));
    }
    if (nextLine) {
        nums.push(...getNumbersForLine(nextLine, start_idx));
    }
    nums.push(...getNumbersForLine(curLine, start_idx));
    return nums;
}

function getGearRatio(lines, line_idx, start_idx) {
    let prevLine =
        line_idx - 1 >= 0 && line_idx - 1 < lines.length
            ? lines[line_idx - 1]
            : null;
    let nextLine =
        line_idx + 1 >= 0 && line_idx + 1 < lines.length
            ? lines[line_idx + 1]
            : null;
    let arrayNums = getAdjacentNumbers(
        lines[line_idx],
        prevLine,
        nextLine,
        start_idx
    );
    return arrayNums.length === 2 ? arrayNums[0] * arrayNums[1] : 0;
}

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    const lines = data.split("\n");
    let sum = lines.reduce((acc, cur_line, line_idx) => {
        let start_idx = 0;
        let local_sum = 0;
        while (start_idx < cur_line.length) {
            if (cur_line[start_idx] === "*") {
                let gearRatio = getGearRatio(lines, line_idx, start_idx);
                local_sum += gearRatio;
            }
            start_idx++;
        }
        return acc + local_sum;
    }, 0);
    console.log(sum);
});

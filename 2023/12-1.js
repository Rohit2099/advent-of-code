const fs = require("fs/promises");
const path = require("path");

const input_path = path.join(__dirname, "12.txt");

function callRec(condition, result, resultIdx, val, conditionIdx, count) {
    if (resultIdx >= result.length && conditionIdx >= condition.length) {
        count.count += 1;
        return true;
    } else if (resultIdx >= result.length || conditionIdx >= condition.length) {
        return false;
    }


    if (condition[conditionIdx] === ".") {
        return callRec(condition, result, resultIdx, val, conditionIdx + 1, count);
    }
    if (condition[conditionIdx] === "?") {
        let started = val < result[resultIdx];
        var useDot = false;
        if (!started) {
            var useDot = callRec(condition, result, resultIdx, val, conditionIdx + 1, count);
        }
        let newResultIdx = val - 1 === 0 ? resultIdx + 1 : resultIdx;
        let newVal = val - 1 === 0 ? result[newResultIdx] : val - 1;
        let useHash = callRec(condition, result, newResultIdx, newVal, conditionIdx + 1, count);

        return useDot || useHash;
    }
    if (condition[conditionIdx] === "#") {
        if (val < result[resultIdx] && result[resultIdx - 1] === ){
            
        }
        let newResultIdx = val - 1 === 0 ? resultIdx + 1 : resultIdx;
        let newVal = val - 1 === 0 ? result[newResultIdx] : val - 1;
        return callRec(condition, result, newResultIdx, newVal, conditionIdx + 1, count);
    }

    return false;
}

function getNumberOfArrangements(record) {
    let count = { count: 0 };
    callRec(record.condition, record.result, 0, record.result[0], 0, count);
    return count.count;
}

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    const lines = data.trim().split("\n");
    const records = lines.map((line) => {
        const vals = line.split(" ");
        const result = vals[1]
            .trim()
            .split(",")
            .map((val) => parseInt(val, 10));
        return {
            condition: vals[0],
            result,
        };
    });

    const result = records.reduce((acc, record) => {
        return acc + getNumberOfArrangements(record);
    }, 0);

    console.log(result);
});

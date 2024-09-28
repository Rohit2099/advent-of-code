const fs = require("fs/promises");
const path = require("path");

const input_path = path.join(__dirname, "12.txt");

function callRec(condition, result, resultIdx, val, conditionIdx, output, prevHash) {
    if (resultIdx >= result.length && conditionIdx >= condition.length) {
        let resultStr = result.join(", ");
        let record = condition + "  " + resultStr;
        output.count += 1;
        output.permutations.push(record);
        return;
    } else if (resultIdx >= result.length) {
        for (let i = conditionIdx; i < condition.length; i++) {
            if (condition[i] === "#") {
                return;
            }
        }
        output.count += 1;
        let resultStr = result.join(", ");
        let newCondition = condition.replaceAll("?", ".");
        let record = newCondition + "  " + resultStr;
        output.permutations.push(record);
        return;
    } else if (conditionIdx >= condition.length) {
        return;
    }

    if (condition[conditionIdx] === ".") {
        let started = val < result[resultIdx];
        if (started) {
            return;
        }
        callRec(condition, result, resultIdx, val, conditionIdx + 1, output, false);
    }
    if (condition[conditionIdx] === "?") {
        let started = val < result[resultIdx];
        if (!started) {
            let newCondition =
                condition.slice(0, conditionIdx) + "." + condition.slice(conditionIdx + 1);
            callRec(newCondition, result, resultIdx, val, conditionIdx + 1, output, false);
        }
        if (started || (!started && !prevHash)) {
            let newResultIdx = val - 1 === 0 ? resultIdx + 1 : resultIdx;
            let newVal = val - 1 === 0 ? result[newResultIdx] : val - 1;
            let newCondition =
                condition.slice(0, conditionIdx) + "#" + condition.slice(conditionIdx + 1);
            callRec(newCondition, result, newResultIdx, newVal, conditionIdx + 1, output, true);
        }
    }
    if (condition[conditionIdx] === "#") {
        let started = val < result[resultIdx];
        if (started || (!started && !prevHash)) {
            let newResultIdx = val - 1 === 0 ? resultIdx + 1 : resultIdx;
            let newVal = val - 1 === 0 ? result[newResultIdx] : val - 1;
            callRec(condition, result, newResultIdx, newVal, conditionIdx + 1, output, true);
        }
    }
}

function getNumberOfArrangements(record) {
    let output = { count: 0, permutations: [] };
    callRec(record.condition, record.result, 0, record.result[0], 0, output);
    return output;
}

function printPermutations(permutations) {
    fs.writeFile("12-out.txt", "").then(() => {
        let strPermutations = permutations.join("\n") + "\n";
        fs.writeFile("12-out.txt", strPermutations, { flag: "a+" });
    });
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

    const result = records.reduce(
        (acc, record) => {
            let res = getNumberOfArrangements(record);
            acc.count += res.count;
            acc.permutations.push(...res.permutations);
            return acc;
        },
        { count: 0, permutations: [] }
    );

    printPermutations(result.permutations);
    console.log(result.count);
});

const fs = require("fs/promises");
const path = require("path");

const input_path = path.join(__dirname, "12.txt");

const getIdx = (resultIdx, conditionIdx, prevHash, val) => {
    return `${resultIdx},${conditionIdx},${prevHash},${val}`;
};

function callRec(condition, result, resultIdx, val, conditionIdx, output, prevHash, dp) {
    let idx = getIdx(resultIdx, conditionIdx, prevHash, val);
    if (dp[idx] !== undefined) {
        output.count += dp[idx];
        return;
    }
    if (resultIdx >= result.length && conditionIdx >= condition.length) {
        output.count += 1;
        if (!dp[idx]) {
            dp[idx] = 0;
        }
        dp[idx] += 1;
        return;
    } else if (resultIdx >= result.length) {
        for (let i = conditionIdx; i < condition.length; i++) {
            if (condition[i] === "#") {
                dp[idx] = 0;
                return;
            }
        }
        output.count += 1;
        if (!dp[idx]) {
            dp[idx] = 0;
        }
        dp[idx] += 1;
        return;
    } else if (conditionIdx >= condition.length) {
        dp[idx] = 0;
        return;
    }

    if (condition[conditionIdx] === ".") {
        let started = val < result[resultIdx];
        if (started) {
            dp[idx] = 0;
            return;
        }
        callRec(condition, result, resultIdx, val, conditionIdx + 1, output, false, dp);
        dp[idx] = dp[getIdx(resultIdx, conditionIdx + 1, false, val)];
        return;
    }
    if (condition[conditionIdx] === "?") {
        let started = val < result[resultIdx];
        let firstDPVal = 0,
            secondDPVal = 0;
        if (!started) {
            let newCondition =
                condition.slice(0, conditionIdx) + "." + condition.slice(conditionIdx + 1);
            callRec(newCondition, result, resultIdx, val, conditionIdx + 1, output, false, dp);
            firstDPVal = dp[getIdx(resultIdx, conditionIdx + 1, false, val)];
        }

        if (started || (!started && !prevHash)) {
            let newResultIdx = val - 1 === 0 ? resultIdx + 1 : resultIdx;
            let newVal = val - 1 === 0 ? result[newResultIdx] : val - 1;
            let newCondition =
                condition.slice(0, conditionIdx) + "#" + condition.slice(conditionIdx + 1);
            callRec(newCondition, result, newResultIdx, newVal, conditionIdx + 1, output, true, dp);
            secondDPVal = dp[getIdx(newResultIdx, conditionIdx + 1, true, newVal)];
        }

        dp[idx] = firstDPVal + secondDPVal;
        return;
    }
    if (condition[conditionIdx] === "#") {
        let started = val < result[resultIdx];
        if (started || (!started && !prevHash)) {
            let newResultIdx = val - 1 === 0 ? resultIdx + 1 : resultIdx;
            let newVal = val - 1 === 0 ? result[newResultIdx] : val - 1;
            callRec(condition, result, newResultIdx, newVal, conditionIdx + 1, output, true, dp);
            dp[idx] = dp[getIdx(newResultIdx, conditionIdx + 1, true, newVal)];
            return;
        }
    }
    dp[idx] = 0;
}

function getNumberOfArrangements(record) {
    let output = { count: 0 };
    let dp = {};
    callRec(record.condition, record.result, 0, record.result[0], 0, output, false, dp);
    return output;
}

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    const lines = data.trim().split("\n");
    const records = lines.map((line) => {
        const vals = line.split(" ");
        const result = vals[1]
            .trim()
            .split(",")
            .map((val) => parseInt(val, 10));
        let newVals = vals[0] + "?" + vals[0] + "?" + vals[0] + "?" + vals[0] + "?" + vals[0];
        result.push(...result, ...result, ...result, ...result);
        return {
            condition: newVals,
            result,
        };
    });

    const result = records.reduce(
        (acc, record) => {
            let res = getNumberOfArrangements(record);
            acc.count += res.count;
            return acc;
        },
        { count: 0 }
    );

    console.log(result.count);
});

const fs = require("fs/promises");
const path = require("path");

const input_path = path.join(__dirname, "6.txt");

function binarySearchBoundary(time, distance) {
    let endTime = time,
        startTime = 0;

    while (true) {
        const midTime = startTime + Math.floor((endTime - startTime) / 2);
        const beforeTime = Math.max(midTime - 1, 0);
        const afterTime = Math.min(midTime + 1, time);

        const midDistance = (time - midTime) * midTime;
        const afterDistance = (time - afterTime) * afterTime;
        const beforeDistance = (time - beforeTime) * beforeTime;

        if (midDistance > distance) {
            if (beforeDistance < distance) {
                return midTime;
            }
            endTime = midTime - 1;
        } else if (distance > midDistance) {
            if (afterDistance > distance) {
                return afterTime;
            }
            if (beforeDistance > distance) {
                return beforeTime;
            }
            if (beforeDistance <= midDistance && midDistance <= afterDistance) {
                startTime = midTime + 1;
            } else {
                endTime = midTime - 1;
            }
        } else {
            return afterTime;
        }
    }
}

function getNumberOfWaysToWin(time, distance) {
    const boundaryTime = binarySearchBoundary(time, distance);
    const anotherBoundary = time - boundaryTime;
    return Math.abs(boundaryTime - anotherBoundary) + 1;
}

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    lines = data.split("\n").slice(0, 2);
    const timeRegex = /Time: (.*)/;
    const distRegex = /Distance: (.*)/;
    let [, times] = lines[0].match(timeRegex);
    let [, distances] = lines[1].match(distRegex);
    times = times
        .trim()
        .split(/\s+/)
        .map((val) => parseInt(val, 10));
    distances = distances
        .trim()
        .split(/\s+/)
        .map((val) => parseInt(val, 10));

    const result = times.reduce((acc, curValue, idx) => {
        const time = curValue;
        const distance = distances[idx];
        return getNumberOfWaysToWin(time, distance) * acc;
    }, 1);

    console.log(result);
});

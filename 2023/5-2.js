const fs = require("fs/promises");
const path = require("path");

const input_path = path.join(__dirname, "5.txt");
let seedToSoil,
    soilToFert,
    fertToWater,
    waterToLight,
    lightToTemp,
    tempToHum,
    humToLoc;

function getRangesFromMap(map, ranges) {
    let newRanges = [];
    let keys = Object.keys(map).sort();

    let idxOfRanges = 0;

    while (idxOfRanges < ranges.length) {
        const curRange = ranges[idxOfRanges];
        const start = curRange[0],
            end = curRange[1];
        let bDeleted = false;
        for (let i = 0; i < keys.length; i++) {
            const offset = map[keys[i]].offset;
            const dest = map[keys[i]].destination;
            const source = parseInt(keys[i], 10);
            if (
                start >= source &&
                start <= source + offset - 1 &&
                end <= source + offset - 1
            ) {
                // start and end are within the map
                newRanges.push([start - source + dest, dest + end - source]);
            } else if (end >= source && end <= source + offset - 1) {
                // end of the range is within the map
                newRanges.push([dest, dest + end - source]);
                ranges.push([start, source - 1]);
            } else if (start >= source && start <= source + offset - 1) {
                // start of the range is within the map
                newRanges.push([dest + start - source, dest + offset - 1]);
                ranges.push([source + offset, end]);
            }
            if (
                (start >= source && start <= source + offset - 1) ||
                (end <= source + offset - 1 && end >= source)
            ) {
                bDeleted = true;
                break;
            }
        }
        if (!bDeleted) {
            idxOfRanges += 1;
        } else {
            ranges.splice(idxOfRanges, 1);
        }
    }
    newRanges.push(...ranges);

    return newRanges;
}

function getMinLocFromRange(ranges) {
    return Math.min(...ranges.flat(1));
}

function calculateRangesRecursively(ranges) {
    let newRanges = [];
    newRanges = getRangesFromMap(seedToSoil, ranges);
    newRanges = getRangesFromMap(soilToFert, newRanges);
    newRanges = getRangesFromMap(fertToWater, newRanges);
    newRanges = getRangesFromMap(waterToLight, newRanges);
    newRanges = getRangesFromMap(lightToTemp, newRanges);
    newRanges = getRangesFromMap(tempToHum, newRanges);
    newRanges = getRangesFromMap(humToLoc, newRanges);

    return getMinLocFromRange(newRanges);
}

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    let [seedsTxt, ...maps] = data.split("\n\n");
    let [, seeds] = seedsTxt.match(/seeds: (.*)/);
    seeds = seeds
        .trim()
        .split(" ")
        .map((val) => parseInt(val));

    let removeHeadings = maps.map((chunk) => {
        let mapping = {};
        chunk = chunk.split("\n");
        chunk.splice(0, 1);
        chunk.forEach((row) => {
            let [dest, source, offset] = row
                .split(" ")
                .map((val) => parseInt(val));
            mapping[source] = {
                offset: offset,
                destination: dest,
            };
        });

        return mapping;
    });
    [
        seedToSoil,
        soilToFert,
        fertToWater,
        waterToLight,
        lightToTemp,
        tempToHum,
        humToLoc,
    ] = removeHeadings;

    // Use a cache to store all the min results. Perform a binary search. If the min value is seen...
    let minSeed = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < seeds.length; i += 2) {
        let ranges = [[seeds[i], seeds[i] + seeds[i + 1] - 1]];
        const minLocation = calculateRangesRecursively(ranges);
        minSeed = Math.min(minLocation, minSeed);
    }
    console.log(minSeed);
});

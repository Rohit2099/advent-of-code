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

function getValueFromMap(map, val) {
    let res = val;
    map.keys().some((source) => {
        let offset = map.get(source).offset;
        if (val >= source && val <= source + offset) {
            let dest = map.get(source).destination;
            res = dest + (val - source);
            return true;
        }
        return false;
    });
    return res;
}

function getLocationFromSeed(seed) {
    let out1 = getValueFromMap(seedToSoil, seed);
    out1 = getValueFromMap(soilToFert, out1);
    out1 = getValueFromMap(fertToWater, out1);
    out1 = getValueFromMap(waterToLight, out1);
    out1 = getValueFromMap(lightToTemp, out1);
    out1 = getValueFromMap(tempToHum, out1);
    out1 = getValueFromMap(humToLoc, out1);
    return out1;
}

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    let [seedsTxt, ...maps] = data.split("\n\n");
    let [, seeds] = seedsTxt.match(/seeds: (.*)/);
    seeds = seeds
        .trim()
        .split(" ")
        .map((val) => parseInt(val));

    let removeHeadings = maps.map((chunk) => {
        let mapping = new Map();
        chunk = chunk.split("\n");
        chunk.splice(0, 1);
        chunk.forEach((row) => {
            let [dest, source, offset] = row
                .split(" ")
                .map((val) => parseInt(val));
            mapping.set(source, {
                offset: offset,
                destination: dest,
            });
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

    let minSeed = seeds.reduce((acc, seed) => {
        let location = getLocationFromSeed(seed);
        return Math.min(acc, location);
    }, Number.MAX_SAFE_INTEGER);

    console.log(minSeed);
});

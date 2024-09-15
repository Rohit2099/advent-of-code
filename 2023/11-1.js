const fs = require("fs/promises");
const path = require("path");

const input_path = path.resolve(__dirname, "11.txt");

function findBlankSpaces(lines) {
    let blank = {
        rows: [],
        cols: [],
    };
    for (let i = 0; i < lines.length; ++i) {
        let idx = lines[i].indexOf("#");
        let prev = blank.rows[blank.rows.length - 1] ?? 0;
        if (idx !== -1) {
            blank.rows.push(prev);
        } else {
            blank.rows.push(prev + 1);
        }
    }

    for (let i = 0; i < lines[0].length; ++i) {
        let galaxyPresent = false;
        for (let j = 0; j < lines.length; ++j) {
            if (lines[j][i] === "#") {
                galaxyPresent = true;
                break;
            }
        }
        let prev = blank.cols[blank.cols.length - 1] ?? 0;
        if (galaxyPresent) {
            blank.cols.push(prev);
        } else {
            blank.cols.push(prev + 1);
        }
    }
    return blank;
}

function findGalaxies(lines) {
    let galaxies = lines.reduce((acc, line, idx) => {
        let start = 0;
        let colidx;
        while ((colidx = line.indexOf("#", start)) !== -1) {
            acc.push([idx, colidx]);
            start = colidx + 1;
        }
        return acc;
    }, []);

    return galaxies;
}

function findDistanceBetweenGalaxies(galaxies, blankSpaces) {
    let result = 0;
    for (let i = 0; i < galaxies.length; ++i) {
        for (let j = i + 1; j < galaxies.length; ++j) {
            let xmin = Math.min(galaxies[i][0], galaxies[j][0]);
            let xmax = Math.max(galaxies[i][0], galaxies[j][0]);

            let xnumOfBlanks = blankSpaces.rows[xmax] - blankSpaces.rows[xmin];
            let xdisplacement = xmax - xmin + xnumOfBlanks;

            let ymin = Math.min(galaxies[i][1], galaxies[j][1]);
            let ymax = Math.max(galaxies[i][1], galaxies[j][1]);

            let ynumOfBlanks = blankSpaces.cols[ymax] - blankSpaces.cols[ymin];
            let ydisplacement = ymax - ymin + ynumOfBlanks;

            result += xdisplacement + ydisplacement;
        }
    }

    return result;
}

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    lines = data.trim().split("\n");
    let galaxies = findGalaxies(lines);
    let blankSpaces = findBlankSpaces(lines);
    let distance = findDistanceBetweenGalaxies(galaxies, blankSpaces);

    console.log(distance);
});

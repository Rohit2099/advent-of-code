// Odd-even rule
// shoelace theorem and pick's theorem
// expanding the maze by adding buffers so that all outside points can be reached using flood fill

const fs = require("fs/promises");
const { sortAscending } = require("./utils");

const path = require("path");

const input_path = path.resolve(__dirname, "10.txt");

const SHAPE_TO_CODE = {
    "|": "\u2502",
    "-": "\u2500",
    L: "\u2514",
    J: "\u2518",
    7: "\u2510",
    F: "\u250C",
    S: "S",
};

function findStartPos(maze) {
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === "S") {
                return [i, j];
            }
        }
    }
}

function getNew2DArray(i, j) {
    let a = new Array(i);
    for (let k = 0; k < i; k++) {
        a[k] = new Array(j);
    }

    return a;
}

function bfs(maze, rowStart, colStart, inputComingFrom) {
    let i = rowStart,
        j = colStart,
        comingFrom = inputComingFrom;
    let visited = getNew2DArray(maze.length, maze[0].length);
    let path = {};
    let boundaryCoords = {};
    while (true) {
        let valid = i >= 0 && i < maze.length && j >= 0 && j < maze[0].length;
        if (!valid) {
            return undefined;
        }
        if (maze[i][j] === "S") {
            if (inputComingFrom === "down") {
                boundaryCoords[i].push(j);
            }
            path[`(${i}, ${j})`] = true;
            return [path, boundaryCoords];
        }
        if (visited[i][j]) {
            return undefined;
        }
        visited[i][j] = true;
        path[`(${i}, ${j})`] = true;

        switch (maze[i][j]) {
            case ".":
                return undefined;
            case "|":
                if (!boundaryCoords[i]) {
                    boundaryCoords[i] = [];
                }
                boundaryCoords[i].push(j);
                if (comingFrom === "down") {
                    i -= 1;
                    comingFrom = "down";
                } else if (comingFrom === "up") {
                    i += 1;
                    comingFrom = "up";
                } else {
                    return undefined;
                }
                break;
            case "-":
                if (comingFrom === "left") {
                    j += 1;
                    comingFrom = "left";
                } else if (comingFrom === "right") {
                    j -= 1;
                    comingFrom = "right";
                } else {
                    return undefined;
                }
                break;
            case "L":
                if (!boundaryCoords[i]) {
                    boundaryCoords[i] = [];
                }
                boundaryCoords[i].push(j);
                if (comingFrom === "up") {
                    j += 1;
                    comingFrom = "left";
                } else if (comingFrom === "right") {
                    i -= 1;
                    comingFrom = "down";
                } else {
                    return undefined;
                }
                break;
            case "J":
                if (!boundaryCoords[i]) {
                    boundaryCoords[i] = [];
                }
                boundaryCoords[i].push(j);
                if (comingFrom === "up") {
                    j -= 1;
                    comingFrom = "right";
                } else if (comingFrom === "left") {
                    i -= 1;
                    comingFrom = "down";
                } else {
                    return undefined;
                }
                break;
            case "7":
                if (comingFrom === "down") {
                    j -= 1;
                    comingFrom = "right";
                } else if (comingFrom === "left") {
                    i += 1;
                    comingFrom = "up";
                } else {
                    return undefined;
                }
                break;
            case "F":
                if (comingFrom === "right") {
                    i += 1;
                    comingFrom = "up";
                } else if (comingFrom === "down") {
                    j += 1;
                    comingFrom = "left";
                } else {
                    return undefined;
                }
                break;
            default:
                return undefined;
        }
    }
}

function findMazePath(maze, startPos) {
    let mazePath;
    // Right
    mazePath = mazePath ?? bfs(maze, startPos[0], startPos[1] + 1, "left");
    // left
    mazePath = mazePath ?? bfs(maze, startPos[0], startPos[1] - 1, "right");
    // up
    mazePath = mazePath ?? bfs(maze, startPos[0] - 1, startPos[1], "down");
    return mazePath;
}

function callBFSFill(mazePath, visited, i, j, rowMax, colMax, outerPoints) {
    if (i < 0 || i >= rowMax || j < 0 || j >= colMax) {
        return 0;
    }
    if (mazePath[`(${i}, ${j})`] || visited[i][j]) {
        return 0;
    }
    outerPoints[`(${i}, ${j})`] = true;
    visited[i][j] = true;
    return (
        1 +
        callBFSFill(mazePath, visited, i + 1, j, rowMax, colMax, outerPoints) +
        callBFSFill(mazePath, visited, i - 1, j, rowMax, colMax, outerPoints) +
        callBFSFill(mazePath, visited, i, j + 1, rowMax, colMax, outerPoints) +
        callBFSFill(mazePath, visited, i, j - 1, rowMax, colMax, outerPoints)
    );
}

function findAreaOutsideLoop(maze, mazePath) {
    let visited = getNew2DArray(maze.length, maze[0].length);
    let outerRegion = 0;
    let n = maze.length;
    let m = maze[0].length;
    let outerPoints = {};
    for (let j = 0; j < m; ++j) {
        if (visited[0][j] || mazePath[`(0, ${j}`]) {
            continue;
        }
        outerRegion += callBFSFill(mazePath, visited, 0, j, n, m, outerPoints);
    }
    for (let j = 0; j < m; ++j) {
        if (visited[n - 1][j] || mazePath[`(${n - 1}, ${j}`]) {
            continue;
        }
        outerRegion += callBFSFill(mazePath, visited, n - 1, j, n, m, outerPoints);
    }
    for (let j = 0; j < n; ++j) {
        if (visited[j][0] || mazePath[`(${j}, 0`]) {
            continue;
        }
        outerRegion += callBFSFill(mazePath, visited, j, 0, n, m, outerPoints);
    }
    for (let j = 0; j < m; ++j) {
        if (visited[j][m - 1] || mazePath[`(${j}, ${m - 1}`]) {
            continue;
        }
        outerRegion += callBFSFill(mazePath, visited, j, m - 1, n, m, outerPoints);
    }
    return outerPoints;
}

function drawMazePath(maze, mazePath, outerPoints) {
    let newMaze = new Array(maze.length);
    for (let i = 0; i < maze.length; ++i) {
        newMaze[i] = new Array(maze[i].length);
        for (let j = 0; j < newMaze[i].length; ++j) {
            newMaze[i][j] = " ";
        }
    }
    for (let entry in mazePath) {
        let [_, i, j] = entry.match(/\((\d+), (\d+)\)/);
        i = parseInt(i);
        j = parseInt(j);
        let pipeChar = SHAPE_TO_CODE[maze[i][j]];
        newMaze[i][j] = pipeChar;
    }

    for (let entry in outerPoints) {
        let [_, i, j] = entry.match(/\((\d+), (\d+)\)/);
        i = parseInt(i);
        j = parseInt(j);
        newMaze[i][j] = "X";
    }

    let finalString = "";
    for (let i = 0; i < newMaze.length; ++i) {
        finalString += newMaze[i].join("") + "\n";
    }
    fs.writeFile("10-out.txt", finalString, { encoding: "utf-8" });
}

function findInnerArea(mazePath, boundaryCoords) {
    let result = 0;
    for (let row in boundaryCoords) {
        let curRow = boundaryCoords[row];
        curRow.sort(sortAscending);
        for (let j = 0; j + 1 < curRow.length; j += 2) {
            for (let start = curRow[j] + 1; start < curRow[j + 1]; ++start) {
                if (!mazePath[`(${row}, ${start})`]) {
                    // Using the correct boundaryCoords will not require to use additional checks on outerPoints.
                    result += 1;
                }
            }
        }
    }
    return result;
}

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    lines = data.trim().split("\n");
    let maze = lines.map((line) => {
        return line.split("");
    });
    const startPos = findStartPos(maze);
    let [mazePath, boundaryCoords] = findMazePath(maze, startPos);
    const outerPoints = findAreaOutsideLoop(maze, mazePath);
    let innerArea = findInnerArea(mazePath, boundaryCoords, outerPoints);
    console.log(innerArea);
    drawMazePath(maze, mazePath, outerPoints);
});

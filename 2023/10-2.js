const fs = require("fs/promises");
const path = require("path");

const input_path = path.resolve(__dirname, "10.txt");

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
    while (true) {
        let valid = i >= 0 && i < maze.length && j >= 0 && j < maze[0].length;
        if (!valid) {
            return undefined;
        }
        if (maze[i][j] === "S") {
            path[`(${i}, ${j})`] = true;
            return path;
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
    console.log(outerRegion);
    for (let j = 0; j < m; ++j) {
        if (visited[n - 1][j] || mazePath[`(${n - 1}, ${j}`]) {
            continue;
        }
        outerRegion += callBFSFill(mazePath, visited, n - 1, j, n, m, outerPoints);
    }
    console.log(outerRegion);
    for (let j = 0; j < n; ++j) {
        if (visited[j][0] || mazePath[`(${j}, 0`]) {
            continue;
        }
        outerRegion += callBFSFill(mazePath, visited, j, 0, n, m, outerPoints);
    }
    console.log(outerRegion);
    for (let j = 0; j < m; ++j) {
        if (visited[j][m - 1] || mazePath[`(${j}, ${m - 1}`]) {
            continue;
        }
        outerRegion += callBFSFill(mazePath, visited, j, m - 1, n, m, outerPoints);
    }
    console.log(outerRegion);
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
        newMaze[i][j] = ".";
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

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    lines = data.trim().split("\n");
    let maze = lines.map((line) => {
        return line.split("");
    });
    const startPos = findStartPos(maze);
    let mazePath = findMazePath(maze, startPos);
    const outerPoints = findAreaOutsideLoop(maze, mazePath);
    drawMazePath(maze, mazePath, outerPoints);
    // const totalPoints = maze.length * maze[0].length;
    // const loopPoints = Object.keys(mazePath).length;
    // const innerPoints = totalPoints - outerArea - loopPoints;
    // console.log(`Maze Length: ${loopPoints}`);
    // console.log(`Total points: ${totalPoints}`);
    // console.log(`Outer Area: ${outerArea}`);
    // console.log(`Inner points: ${innerPoints}`);
});

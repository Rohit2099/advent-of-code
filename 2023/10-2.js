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
    let path = [];
    while (true) {
        let valid = i >= 0 && i < maze.length && j >= 0 && j < maze[0].length;
        if (!valid) {
            return undefined;
        }
        if (maze[i][j] === "S") {
            path.push([i, j]);
            return path;
        }
        if (visited[i][j]) {
            return undefined;
        }
        visited[i][j] = true;
        path.push([i, j]);

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

function findAreaFromPath(maze, mazePath) {
    let rowToColMap = {};
    for (let i = 0; i < mazePath.length; ++i) {
        if (!rowToColMap[mazePath[i][0]]) {
            rowToColMap[mazePath[i][0]] = [];
        }
        rowToColMap[mazePath[i][0]].push(mazePath[i][1]);
    }

    const convertToInt = (a, b) => {
        if (parseInt(a) > parseInt(b)) {
            return 1;
        } else {
            return -1;
        }
    };

    let area = 0;
    for (let rows in rowToColMap) {
        let cols = rowToColMap[rows];
        cols.sort(convertToInt);

        for (let i = 0; i + 1 < cols.length; i += 2) {
            let start = cols[i],
                end = cols[i + 1];
            area += end - start - 1;
        }
    }
    return area;
}

function drawMazePath(maze, mazePath) {
    let newMaze = new Array(maze.length);
    for (let i = 0; i < maze.length; ++i) {
        newMaze[i] = new Array(maze[i].length);
        for (let j = 0; j < newMaze[i].length; ++j) {
            newMaze[i][j] = " ";
        }
    }
    for (let i = 0; i < mazePath.length; ++i) {
        newMaze[mazePath[i][0]][mazePath[i][1]] = ".";
    }

    let finalString = "";
    for (let i = 0; i < newMaze.length; ++i) {
        finalString += newMaze[i].join(" ") + "\n";
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
    drawMazePath(maze, mazePath);
    const area = findAreaFromPath(maze, mazePath);
    console.log(area);
});

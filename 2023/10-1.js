const { lstatSync } = require("fs");
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
    let result = 0;
    let visited = getNew2DArray(maze.length, maze[0].length);
    while (true) {
        let valid = i >= 0 && i < maze.length && j >= 0 && j < maze[0].length;
        if (!valid) {
            return undefined;
        }
        if (maze[i][j] === "S") {
            return result + 1;
        }
        if (visited[i][j]) {
            return undefined;
        }
        visited[i][j] = true;

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
        result += 1;
    }
}

function findMazeLength(maze, startPos) {
    // Right
    let numberOfSteps;
    numberOfSteps = numberOfSteps ?? bfs(maze, startPos[0], startPos[1] + 1, "left");
    // left
    numberOfSteps = numberOfSteps ?? bfs(maze, startPos[0], startPos[1] - 1, "right");
    // up
    numberOfSteps = numberOfSteps ?? bfs(maze, startPos[0] - 1, startPos[1], "down");
    return numberOfSteps;
}

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    lines = data.trim().split("\n");
    let maze = lines.map((line) => {
        return line.split("");
    });
    const startPos = findStartPos(maze);
    let mazeLength = findMazeLength(maze, startPos);
    const numberOfSteps = Math.floor(mazeLength / 2);

    console.log(numberOfSteps);
});

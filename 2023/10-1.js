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

function bfs(maze, i, j, visited, comingFrom) {
    let valid = i >= 0 && i < maze.length && j >= 0 && j < maze[0].length;
    if (!valid) {
        return undefined;
    }
    if (maze[i][j] === "S") {
        return 1;
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
                return 1 + bfs(maze, i - 1, j, visited, "down");
            } else if (comingFrom === "up") {
                return 1 + bfs(maze, i + 1, j, visited, "up");
            } else {
                return undefined;
            }
        case "-":
            if (comingFrom === "left") {
                return 1 + bfs(maze, i, j + 1, visited, "left");
            } else if (comingFrom === "right") {
                return 1 + bfs(maze, i, j - 1, visited, "right");
            } else {
                return undefined;
            }
        case "L":
            if (comingFrom === "up") {
                return 1 + bfs(maze, i, j + 1, visited, "left");
            } else if (comingFrom === "right") {
                return 1 + bfs(maze, i - 1, j, visited, "down");
            } else {
                return undefined;
            }
        case "J":
            if (comingFrom === "up") {
                return 1 + bfs(maze, i, j - 1, visited, "right");
            } else if (comingFrom === "left") {
                return 1 + bfs(maze, i - 1, j, visited, "down");
            } else {
                return undefined;
            }
        case "7":
            if (comingFrom === "down") {
                return 1 + bfs(maze, i, j - 1, visited, "right");
            } else if (comingFrom === "left") {
                return 1 + bfs(maze, i + 1, j, visited, "up");
            } else {
                return undefined;
            }
        case "F":
            if (comingFrom === "right") {
                return 1 + bfs(maze, i + 1, j, visited, "up");
            } else if (comingFrom === "down") {
                return 1 + bfs(maze, i, j + 1, visited, "left");
            } else {
                return undefined;
            }
        default:
            return undefined;
    }
}

function findMazeLength(maze, startPos) {
    let numberOfSteps = undefined;
    let visited = getNew2DArray(maze.length, maze[0].length);
    visited[startPos[0]][startPos[1]] = true;
    // Right
    numberOfSteps = numberOfSteps ?? bfs(maze, startPos[0], startPos[1] + 1, visited, "left");
    visited = getNew2DArray(maze.length, maze[0].length);
    visited[startPos[0]][startPos[1]] = true;
    // left
    numberOfSteps = numberOfSteps ?? bfs(maze, startPos[0], startPos[1] - 1, visited, "right");
    visited = getNew2DArray(maze.length, maze[0].length);
    visited[startPos[0]][startPos[1]] = true;
    // up
    numberOfSteps = numberOfSteps ?? bfs(maze, startPos[0] - 1, startPos[1], visited, "down");
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

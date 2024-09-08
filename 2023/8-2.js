const fs = require("fs/promises");
const path = require("path");
const Tree = require("./Tree");
const utils = require("./utils");

const input_path = path.resolve(__dirname, "8.txt");
const TreeNode = Tree.TreeNode;

function createTree(nodes) {
    let sourceToNodeMapping = new Map();
    for (let node of nodes) {
        const source = node[0];
        const left = node[1];
        const right = node[2];

        let leftNode = sourceToNodeMapping.get(left) ?? new TreeNode(left);
        sourceToNodeMapping.set(left, leftNode);
        let rightNode = sourceToNodeMapping.get(right) ?? new TreeNode(right);
        sourceToNodeMapping.set(right, rightNode);
        let sourceNode = sourceToNodeMapping.get(source) ?? new TreeNode(source);
        sourceToNodeMapping.set(source, sourceNode);

        sourceNode.left = leftNode;
        sourceNode.right = rightNode;
    }

    let setOfHeads = sourceToNodeMapping.keys().reduce((acc, val) => {
        if (val[2] === "A") {
            acc.push(sourceToNodeMapping.get(val));
        }
        return acc;
    }, []);

    return setOfHeads;
}

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    let lines = data.trim("\n").split("\n");

    const directions = lines[0];
    lines = lines.slice(2);

    const nodes = lines.map((line) => {
        let [source, destinations] = line.split(" = ");
        const [left, right] = destinations
            .slice(1, -1)
            .split(",")
            .map((val) => val.trim());

        return [source, left, right];
    });
    let setOfHeads = createTree(nodes);

    let results = [];

    for (let i = 0; i < setOfHeads.length; i++) {
        let idx = 0;
        let numberOfSteps = 0;
        let curNode = setOfHeads[i];

        while (idx < directions.length) {
            const direction = directions[idx];

            if (curNode.value[2] === "Z") {
                break;
            }
            if (direction === "L") {
                curNode = curNode.left;
            } else {
                curNode = curNode.right;
            }
            numberOfSteps++;

            idx = idx === directions.length - 1 ? 0 : idx + 1;
        }
        results.push(numberOfSteps);
    }
    const totalNumberOfWays = utils.lcmOfNums(...results);

    console.log(totalNumberOfWays);
});

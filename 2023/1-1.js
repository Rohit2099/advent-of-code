const fs = require("fs/promises");
const path = require("path");

const input_path = path.join(__dirname, "1.txt");

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    let lines = data.split("\n");
    let sum = lines.reduce((acc_sum, cur_line) => {
        let digits = [];
        for (let i = 0; i < cur_line.length; i++) {
            if (!Number.isNaN(parseInt(cur_line[i], 10))) {
                digits.push(cur_line[i]);
            }
        }
        const num = parseInt(digits[0] + digits[digits.length - 1], 10);
        return Number.isInteger(num) ? acc_sum + num : acc_sum;
    }, 0);
    console.log(sum);
});

const fs = require("fs/promises");
const path = require("path");

const cubes_req = new Map();
cubes_req.set("red", 12).set("green", 13).set("blue", 14);

const input_path = path.join(__dirname, "2.txt");

// Regexp for matching a line
// const game_id_regex = /Game (\d+): (( ?[\d]+ (red|blue|green),?)+;?)+/g;

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    lines = data.split("\n");
    let game_id_sum = lines.reduce((acc, cur_line) => {
        let [game, cubes] = cur_line.split(":");
        cubes = cubes.trim().split(";");
        let game_id = parseInt(game.split(" ")[1]);
        let matched = cubes.every((draw) => {
            colors = draw.trim().split(",");
            let matched_local = colors.every((color) => {
                const [num, color_cube] = color.trim().split(" ");
                return cubes_req.get(color_cube) >= parseInt(num);
            });
            return matched_local;
        });

        return matched ? acc + game_id : acc;
    }, 0);
    console.log(game_id_sum);
});

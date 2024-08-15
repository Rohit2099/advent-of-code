const fs = require("fs/promises");
const path = require("path");

const input_path = path.join(__dirname, "3-4.txt");

fs.readFile(input_path, { encoding: "utf-8" }).then((data) => {
    lines = data.split("\n");
    let total_sum = lines.reduce((acc, cur_line) => {
        let [_, cubes] = cur_line.split(":");
        cubes = cubes.trim().split(";");
        let min_cubes = cubes.reduce(
            (min_cube, draw) => {
                colors = draw.trim().split(",");
                colors.forEach((color) => {
                    const [num, color_cube] = color.trim().split(" ");
                    min_cube[color_cube] = Math.max(
                        min_cube[color_cube],
                        parseInt(num, 10)
                    );
                });
                return min_cube;
            },
            {
                red: 0,
                blue: 0,
                green: 0,
            }
        );
        return acc + min_cubes.red * min_cubes.blue * min_cubes.green;
    }, 0);
    console.log(total_sum);
});

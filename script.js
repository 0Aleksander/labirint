const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const rows = 15;
const cols = 20;
const cellSize = 30;
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let maze = [];
let solution = [];

function generateMaze() {
    maze = createEmptyMaze();
    carvePath(0, 0);
    solution = [];
    drawMaze();
}

function createEmptyMaze() {
    const maze = [];
    for (let row = 0; row < rows; row++) {
        maze[row] = [];
        for (let col = 0; col < cols; col++) {
            maze[row][col] = {
                top: true,
                right: true,
                bottom: true,
                left: true,
                visited: false
            };
        }
    }
    return maze;
}

function carvePath(row, col) {
    maze[row][col].visited = true;
    const directions = ["top", "right", "bottom", "left"];
    directions.sort(() => Math.random() - 0.5);

    directions.forEach((direction) => {
        let newRow = row;
        let newCol = col;
        if (direction === "top") newRow--;
        else if (direction === "right") newCol++;
        else if (direction === "bottom") newRow++;
        else if (direction === "left") newCol--;

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !maze[newRow][newCol].visited) {
            maze[row][col][direction] = false;
            maze[newRow][newCol][oppositeDirection(direction)] = false;
            carvePath(newRow, newCol);
        }
    });
}

function oppositeDirection(direction) {
    switch (direction) {
        case "top": return "bottom";
        case "right": return "left";
        case "bottom": return "top";
        case "left": return "right";
    }
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * cellSize;
            const y = row * cellSize;
            const cell = maze[row][col];
            
            // Draw walls
            ctx.beginPath();
            if (cell.top) ctx.moveTo(x, y), ctx.lineTo(x + cellSize, y);
            if (cell.right) ctx.moveTo(x + cellSize, y), ctx.lineTo(x + cellSize, y + cellSize);
            if (cell.bottom) ctx.moveTo(x, y + cellSize), ctx.lineTo(x + cellSize, y + cellSize);
            if (cell.left) ctx.moveTo(x, y), ctx.lineTo(x, y + cellSize);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}

function solveMaze() {
    solution = [];
    const visited = [];
    for (let i = 0; i < rows; i++) {
        visited[i] = [];
    }

    function dfs(row, col) {
        if (row === rows - 1 && col === cols - 1) {
            solution.push([row, col]);
            return true;
        }

        visited[row][col] = true;
        solution.push([row, col]);

        const directions = [
            [-1, 0, "top"],
            [1, 0, "bottom"],
            [0, -1, "left"],
            [0, 1, "right"]
        ];

        for (let [dRow, dCol, direction] of directions) {
            let newRow = row + dRow;
            let newCol = col + dCol;

            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !visited[newRow][newCol] && !maze[row][col][direction]) {
                if (dfs(newRow, newCol)) {
                    return true;
                }
            }
        }

        solution.pop();
        return false;
    }

    dfs(0, 0);
    drawMaze();
    drawSolution();
}

function drawSolution() {
    ctx.fillStyle = "blue";
    solution.forEach(([row, col]) => {
        ctx.fillRect(col * cellSize + 10, row * cellSize + 10, cellSize - 20, cellSize - 20);
    });
}

document.getElementById("generateMazeBtn").addEventListener("click", generateMaze);
document.getElementById("solveMazeBtn").addEventListener("click", solveMaze);

generateMaze();

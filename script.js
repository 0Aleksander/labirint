const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");
const cols = 20;
const rows = 20;
const cellSize = 20;
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;
let grid = [];
let solution = [];

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visited = false;
        this.walls = { top: true, right: true, bottom: true, left: true };
        this.previous = null;  // For pathfinding
    }
}

function createGrid() {
    const grid = [];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            grid.push(new Cell(x, y));
        }
    }
    return grid;
}

function getCell(x, y) {
    if (x < 0 || y < 0 || x >= cols || y >= rows) return undefined;
    return grid[y * cols + x];
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#e94560";
    ctx.lineWidth = 2;
    grid.forEach(cell => {
        const x = cell.x * cellSize;
        const y = cell.y * cellSize;
        if (cell.walls.top) ctx.strokeRect(x, y, cellSize, 1);
        if (cell.walls.right) ctx.strokeRect(x + cellSize, y, 1, cellSize);
        if (cell.walls.bottom) ctx.strokeRect(x, y + cellSize, cellSize, 1);
        if (cell.walls.left) ctx.strokeRect(x, y, 1, cellSize);
    });

    ctx.fillStyle = "#00ff99";
    ctx.fillRect(2, 2, cellSize - 4, cellSize - 4);
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect((cols - 1) * cellSize + 2, (rows - 1) * cellSize + 2, cellSize - 4, cellSize - 4);
}

function generateMaze() {
    grid = createGrid();
    solution = [];  // Clear any previous solution
    const stack = [];
    let current = grid[0];
    current.visited = true;
    stack.push(current);

    while (stack.length) {
        const neighbors = [
            getCell(current.x, current.y - 1),
            getCell(current.x + 1, current.y),
            getCell(current.x, current.y + 1),
            getCell(current.x - 1, current.y)
        ].filter(cell => cell && !cell.visited);

        if (neighbors.length) {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            removeWalls(current, next);
            next.visited = true;
            next.previous = current;
            stack.push(next);
            current = next;
        } else {
            current = stack.pop();
        }
    }
    drawMaze();
}

function removeWalls(a, b) {
    if (a.x < b.x) { a.walls.right = false; b.walls.left = false; }
    else if (a.x > b.x) { a.walls.left = false; b.walls.right = false; }
    else if (a.y < b.y) { a.walls.bottom = false; b.walls.top = false; }
    else if (a.y > b.y) { a.walls.top = false; b.walls.bottom = false; }
}

function findSolution() {
    let current = grid[grid.length - 1];
    while (current !== grid[0]) {
        solution.push(current);
        current = current.previous;
    }
    solution.push(grid[0]);
    solution.reverse(); // The solution is in reverse order, so we reverse it
}

function animateSolution() {
    solution = [];
    findSolution();
    let i = 0;
    const stepDelay = 100; // Delay between steps in milliseconds

    function animate() {
        if (i < solution.length) {
            // Redraw maze without clearing the entire canvas
            drawMaze();

            // Get current cell and apply animation
            const cell = solution[i];
            const x = cell.x * cellSize;
            const y = cell.y * cellSize;

            // Draw the current cell of the solution path
            ctx.fillStyle = "#ffffff"; // White color for solution path
            ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);

            i++;
            setTimeout(animate, stepDelay); // Control step delay
        } else {
            // Start blinking once we reach the end of the solution path
            blinkSolution();
        }
    }

    animate();
}

function blinkSolution() {
    let blinkCount = 0;
    const blinkInterval = 500; // 500ms for each blink cycle
    const maxBlinks = 5; // How many times the path blinks

    const blink = setInterval(() => {
        drawMaze(); // Redraw maze
        ctx.fillStyle = blinkCount % 2 === 0 ? "#ffffff" : "#0f3460"; // Toggle between white and maze color
        solution.forEach(cell => {
            const x = cell.x * cellSize;
            const y = cell.y * cellSize;
            ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
        });
        blinkCount++;

        if (blinkCount >= maxBlinks * 2) {
            clearInterval(blink); // Stop blinking after maxBlinks
        }
    }, blinkInterval);
}

generateMaze();

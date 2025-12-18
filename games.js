// ------------------- MENU -------------------
function openGame(id) {
    document.querySelectorAll('.game-screen').forEach(g => g.style.display = "none");
    document.getElementById(id).style.display = "block";

    if (id === "car") startCarGame();
    if (id === "snake") startSnake();
    if (id === "tic") startTic();
    if (id === "hill") startHill();
}

function backToMenu() {
    location.reload();
}

// ------------------- CAR RACE GAME -------------------
function startCarGame() {
    const canvas = document.getElementById("carGame");
    const ctx = canvas.getContext("2d");

    let player = { x: 130, y: 400, w: 40, h: 70 };
    let enemy = { x: Math.random()*250, y: -80, w: 40, h: 70 };

    document.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft" && player.x > 0) player.x -= 20;
        if (e.key === "ArrowRight" && player.x < 260) player.x += 20;
    });

    function gameLoop() {
        ctx.clearRect(0, 0, 300, 500);

        // Player
        ctx.fillStyle = "blue";
        ctx.fillRect(player.x, player.y, player.w, player.h);

        // Enemy Car
        ctx.fillStyle = "red";
        ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);

        enemy.y += 5;

        if (enemy.y > 500) {
            enemy.y = -60;
            enemy.x = Math.random()*250;
        }

        // Collision
        if (player.x < enemy.x + enemy.w &&
            player.x + player.w > enemy.x &&
            player.y < enemy.y + enemy.h &&
            player.y + player.h > enemy.y) {
            alert("Game Over!");
            backToMenu();
        }

        requestAnimationFrame(gameLoop);
    }
    gameLoop();
}

// ------------------- HILL CLIMB -------------------
function startHill() {
    const canvas = document.getElementById("hillGame");
    const ctx = canvas.getContext("2d");

    let car = { x: 130, y: 350, w: 40, h: 30, speed: 0 };

    document.addEventListener("keydown", e => {
        if (e.key === "ArrowUp") car.speed += 0.2;
        if (e.key === "ArrowDown") car.speed -= 0.2;
    });

    let angle = 0;

    function gameLoop() {
        ctx.clearRect(0, 0, 300, 500);

        // Road (hill)
        ctx.beginPath();
        ctx.moveTo(0, 400);
        ctx.lineTo(300, 400 + Math.sin(angle) * 40);
        ctx.stroke();

        angle += 0.05;

        // Move car
        car.y -= car.speed;

        // Car
        ctx.fillStyle = "purple";
        ctx.fillRect(car.x, car.y, car.w, car.h);

        requestAnimationFrame(gameLoop);
    }
    gameLoop();
}

// ------------------- SNAKE GAME -------------------
function startSnake() {
    const cvs = document.getElementById("snakeGame");
    const ctx = cvs.getContext("2d");

    let box = 15;
    let snake = [{ x: 5*box, y: 5*box }];
    let food = {
        x: Math.floor(Math.random()*20)*box,
        y: Math.floor(Math.random()*20)*box
    };
    let dir;
    let score = 0;

    document.addEventListener("keydown", e => {
        if (e.key === "ArrowUp" && dir !== "DOWN") dir = "UP";
        if (e.key === "ArrowDown" && dir !== "UP") dir = "DOWN";
        if (e.key === "ArrowLeft" && dir !== "RIGHT") dir = "LEFT";
        if (e.key === "ArrowRight" && dir !== "LEFT") dir = "RIGHT";
    });

    function draw() {
        ctx.clearRect(0, 0, 300, 300);

        // Snake
        snake.forEach((s, i) => {
            ctx.fillStyle = i === 0 ? "green" : "lightgreen";
            ctx.fillRect(s.x, s.y, box, box);
        });

        // Food
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, box, box);

        // Move
        let head = { x: snake[0].x, y: snake[0].y };
        if (dir === "UP") head.y -= box;
        if (dir === "DOWN") head.y += box;
        if (dir === "LEFT") head.x -= box;
        if (dir === "RIGHT") head.x += box;

        // Eat food
        if (head.x === food.x && head.y === food.y) {
            score++;
            document.getElementById("snakeScore").textContent = "Score: " + score;
            food = {
                x: Math.floor(Math.random()*20)*box,
                y: Math.floor(Math.random()*20)*box
            };
        } else {
            snake.pop();
        }

        snake.unshift(head);

        // Collision
        if (head.x < 0 || head.x > 285 || head.y < 0 || head.y > 285 ||
            snake.slice(1).some(s => s.x === head.x && s.y === head.y)) {
            alert("Game Over!");
            backToMenu();
        }
    }

    setInterval(draw, 120);
}

// ------------------- TIC TAC TOE -------------------
function startTic() {
    const cells = document.querySelectorAll("[data-cell]");
    const status = document.getElementById("status");
    let turn = "X";

    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    cells.forEach(cell => {
        cell.onclick = () => {
            if (cell.textContent !== "") return;

            cell.textContent = turn;
            cell.style.fontSize = "40px";

            if (checkWin()) {
                status.textContent = turn + " Wins!";
                cells.forEach(c => c.onclick = null);
                return;
            }

            turn = turn === "X" ? "O" : "X";
            status.textContent = turn + "'s Turn";
        };
    });

    function checkWin() {
        return winPatterns.some(p => {
            return p.every(index => cells[index].textContent === turn);
        });
    }
}
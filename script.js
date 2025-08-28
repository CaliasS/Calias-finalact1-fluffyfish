const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 500;

let fishY = canvas.height / 2;
let velocity = 0;
const gravity = 0.5;
const lift = -8;

let pipes = [];
let frame = 0;
let score = 0;

let gameOver = false;
let playing = false;

// Sounds
const bgMusic = document.getElementById("bgMusic");
const swimSound = document.getElementById("swimSound");
const pointSound = document.getElementById("pointSound");

const fishImg = new Image();
fishImg.src = "fish.png";

document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("score").style.display = "block";
  startGame();
});

window.addEventListener("click", () => {
  if (gameOver) {
    resetGame();
    return;
  }

  if (playing) {
    velocity = lift;
    swimSound.currentTime = 0;
    swimSound.play();
  }
});

function startGame() {
  playing = true;
  gameOver = false;
  fishY = canvas.height / 2;
  velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;
  bgMusic.play();
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  document.getElementById("start-screen").style.display = "flex";
  document.getElementById("score").style.display = "none";
  bgMusic.pause();
  bgMusic.currentTime = 0;
  playing = false;
  gameOver = false;
  fishY = canvas.height / 2;
  velocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawFish() {
  ctx.drawImage(fishImg, 60, fishY - 20, 40, 40);
}

function drawPipes() {
  ctx.fillStyle = "#009933";
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipe.gap, pipe.width, canvas.height);
  });
}

function updatePipes() {
  if (frame % 90 === 0) {
    const top = Math.random() * 200 + 50;
    pipes.push({
      x: canvas.width,
      top: top,
      gap: 150,
      width: 50,
    });
  }

  pipes.forEach((pipe) => {
    pipe.x -= 2;

    if (
      80 + 20 > pipe.x &&
      80 - 20 < pipe.x + pipe.width &&
      (fishY - 20 < pipe.top || fishY + 20 > pipe.top + pipe.gap)
    ) {
      endGame();
    }

    if (!pipe.scored && pipe.x + pipe.width < 80) {
      pipe.scored = true;
      score++;
      pointSound.currentTime = 0;
      pointSound.play();
    }
  });

  pipes = pipes.filter((pipe) => pipe.x + pipe.width > 0);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!playing && !gameOver) return;

  velocity += gravity;
  fishY += velocity;

  drawFish();
  updatePipes();
  drawPipes();

  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);

  if (fishY > canvas.height || fishY < 0) {
    endGame();
  }

  frame++;
  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  } else {
    drawGameOver();
  }
}

function endGame() {
  gameOver = true;
  playing = false;
  bgMusic.pause();
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "28px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2 - 20);
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width / 2 - 40, canvas.height / 2 + 10);
  ctx.fillText("Click to play again", canvas.width / 2 - 90, canvas.height / 2 + 50);
}
function updateOnlineStatus() {
    const offlineBanner = document.getElementById("offline");
    if (navigator.onLine) {
      offlineBanner.style.display = "none";
    } else {
      offlineBanner.style.display = "block";
    }
  }
  
  // Initial check
  updateOnlineStatus();
  
  // Listen for changes
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  
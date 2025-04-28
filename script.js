document.addEventListener('DOMContentLoaded', () => {
  const startGameModalBtn = document.getElementById('start-game-modal-btn');
  const playAgainBtn = document.getElementById('play-again-btn');
  const resetBtn = document.getElementById('reset-btn');
  
  const welcomePrompt = document.getElementById('welcome-prompt');
  const gameOverPrompt = document.getElementById('game-over-prompt');
  const gameContainer = document.getElementById('game-container');
  const scoreDisplay = document.getElementById('score');
  const finalScoreDisplay = document.getElementById('final-score');
  const difficultySelect = document.getElementById('difficulty');

  let score = 0;
  let dirtyDropletCount = 0;
  let dirtyDropletLimit = 5;
  let gameInterval;
  let gameActive = false;
  let goalScore = 20;

  // Show the welcome prompt on page load
  showWelcomePrompt();

  startGameModalBtn.addEventListener('click', () => {
    hideWelcomePrompt();
    startGame();
  });

  playAgainBtn.addEventListener('click', () => {
    hideGameOverPrompt();
    startGame();
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(gameInterval);
    resetGame();
    if (gameActive) {
      startGame();
    }
  });

  function startGame() {
    // Set difficulty
    const difficulty = difficultySelect.value;
    if (difficulty === 'easy') {
      goalScore = 15;
      dirtyDropletLimit = 6;
    } else if (difficulty === 'normal') {
      goalScore = 20;
      dirtyDropletLimit = 5;
    } else if (difficulty === 'hard') {
      goalScore = 25;
      dirtyDropletLimit = 4;
    }

    resetGame(); // Clear everything first
    gameActive = true;

    let intervalSpeed = (difficulty === 'easy') ? 1200 : (difficulty === 'normal') ? 1000 : 800;
    gameInterval = setInterval(createDrop, intervalSpeed);
  }

  function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    finalScoreDisplay.textContent = score;
    showGameOverPrompt();
  }

  function resetGame() {
    score = 0;
    dirtyDropletCount = 0;
    updateScore();
    while (gameContainer.firstChild) {
      gameContainer.removeChild(gameContainer.firstChild);
    }
  }

  function updateScore() {
    scoreDisplay.textContent = score;
  }

  function showWelcomePrompt() {
    welcomePrompt.classList.remove('hidden');
  }

  function hideWelcomePrompt() {
    welcomePrompt.classList.add('hidden');
  }

  function showGameOverPrompt() {
    gameOverPrompt.classList.remove('hidden');
  }

  function hideGameOverPrompt() {
    gameOverPrompt.classList.add('hidden');
  }

  function collectCleanDroplet() {
    score += 1;
    updateScore();

    if (score >= goalScore) {
      endGame();
    }
  }

  function collectDirtyDroplet() {
    dirtyDropletCount++;
    if (dirtyDropletCount >= dirtyDropletLimit) {
      endGame();
    }
  }

  function createDrop() {
    if (!gameActive) return;

    const drop = document.createElement('div');
    const isBadDrop = Math.random() < 0.2;
    drop.className = isBadDrop ? 'water-drop bad-drop' : 'water-drop';

    const gameWidth = gameContainer.offsetWidth;
    const randomX = Math.random() * (gameWidth - 40);
    drop.style.left = `${randomX}px`;

    const difficulty = difficultySelect.value;
    drop.style.animationDuration = (difficulty === 'easy') ? '5s' : (difficulty === 'normal') ? '4s' : '3s';

    drop.addEventListener('click', () => {
      if (!gameActive) return;
      drop.remove();
      if (isBadDrop) {
        collectDirtyDroplet();
      } else {
        collectCleanDroplet();
      }
    });

    gameContainer.appendChild(drop);

    drop.addEventListener('animationend', () => {
      drop.remove();
    });
  }
});
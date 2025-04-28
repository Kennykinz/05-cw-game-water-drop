document.addEventListener('DOMContentLoaded', () => {
  const startGameBtn = document.getElementById('start-game-btn');
  const playAgainBtn = document.getElementById('play-again-btn'); // New button
  const resetBtn = document.getElementById('reset-btn'); // New reset button
  const welcomePrompt = document.getElementById('welcome-prompt');
  const gameOverPrompt = document.getElementById('game-over-prompt');
  const gameContainer = document.getElementById('game-container');
  const scoreDisplay = document.getElementById('score');
  const finalScoreDisplay = document.getElementById('final-score');
  const difficultySelect = document.getElementById('difficulty'); // New

  let score = 0;
  let dirtyDropletCount = 0;
  let dirtyDropletLimit = 5;
  let gameInterval;
  let gameActive = false;
  let goalScore = 20; // Default Normal goal

  // Show the welcome prompt on page load
  showWelcomePrompt();

  // Start Game
  startGameBtn.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default link behavior if it's a link (not necessary but good practice)
      console.log('Start game button clicked'); // Debug log
      hideWelcomePrompt();  // Hide the welcome prompt
      startGame(); // Start the game
  });

  // Play Again (on game over screen)
  playAgainBtn.addEventListener('click', () => {
      hideGameOverPrompt();
      resetGame();
      startGame();
  });

  // Reset Game Button (to reset without starting again)
  if (resetBtn) {
      resetBtn.addEventListener('click', () => {
          resetGame();
      });
  }

  // Start Game Logic
  function startGame() {
      // Set difficulty settings
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

      resetGame();
      gameActive = true;

      // Faster drop creation depending on difficulty
      let intervalSpeed = (difficulty === 'easy') ? 1200 : (difficulty === 'normal') ? 1000 : 800;
      gameInterval = setInterval(createDrop, intervalSpeed);
  }

  // End Game Logic
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
      const isBadDrop = Math.random() < 0.2; // 20% chance of bad drop
      drop.className = isBadDrop ? 'water-drop bad-drop' : 'water-drop';

      const gameWidth = gameContainer.offsetWidth;
      const randomX = Math.random() * (gameWidth - 40);
      drop.style.left = `${randomX}px`;

      // Adjust fall speed based on difficulty
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

      // Remove drop if it reaches the bottom (animation end)
      drop.addEventListener('animationend', () => {
          drop.remove();
          if (!isBadDrop) {
              // Only penalize for missed clean droplets if you want
              // collectDirtyDroplet();
          }
      });
  }
});
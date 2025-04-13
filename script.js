document.addEventListener('DOMContentLoaded', () => {
    const startGameBtn = document.getElementById('start-game-btn');
    const restartGameBtn = document.getElementById('restart-game-btn');
    const welcomePrompt = document.getElementById('welcome-prompt');
    const gameOverPrompt = document.getElementById('game-over-prompt');
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('score');
    const finalScoreDisplay = document.getElementById('final-score');

    let score = 0;
    let dirtyDropletCount = 0;
    const dirtyDropletLimit = 5;
    let gameInterval;
    let gameActive = false;

    // Show the welcome prompt on page load
    showWelcomePrompt();

    // Start Game
    startGameBtn.addEventListener('click', () => {
        hideWelcomePrompt();
        startGame();
    });

    // Restart Game
    restartGameBtn.addEventListener('click', () => {
        hideGameOverPrompt();
        resetGame();
        startGame();
    });

    function startGame() {
        score = 0;
        dirtyDropletCount = 0;
        updateScore();
        gameActive = true;
        gameInterval = setInterval(createDrop, 1000); // Start spawning drops
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

    // Example: Increment score
    function collectCleanDroplet() {
        score += 100;
        updateScore();
    }

    // Example: Increment dirty droplet count
    function collectDirtyDroplet() {
        dirtyDropletCount++;
        if (dirtyDropletCount >= dirtyDropletLimit) {
            endGame();
        }
    }

    // Function to create and manage individual water drops
    function createDrop() {
        const drop = document.createElement('div');
        const isBadDrop = Math.random() < 0.2; // 20% chance of bad drop
        drop.className = isBadDrop ? 'water-drop bad-drop' : 'water-drop';

        const gameWidth = gameContainer.offsetWidth;
        const randomX = Math.random() * (gameWidth - 40);
        drop.style.left = `${randomX}px`;
        drop.style.animationDuration = '4s';

        drop.addEventListener('click', () => {
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
            if (isBadDrop) {
                collectDirtyDroplet();
            }
        });
    }
});

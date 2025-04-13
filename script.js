document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-game-btn');
    const restartBtn = document.getElementById('restart-game-btn');
    const scoreDisplay = document.getElementById('score');
    const finalScoreDisplay = document.getElementById('final-score');
    const welcomePrompt = document.getElementById('welcome-prompt');
    const gameOverPrompt = document.getElementById('game-over-prompt');
    let score = 0;
    let dirtyDropletCount = 0;
    const dirtyDropletLimit = 5;

    // Start Game
    startBtn.addEventListener('click', () => {
        welcomePrompt.classList.add('hidden');
        startGame();
    });

    // Restart Game
    restartBtn.addEventListener('click', () => {
        gameOverPrompt.classList.add('hidden');
        resetGame();
        startGame();
    });

    function startGame() {
        score = 0;
        dirtyDropletCount = 0;
        updateScore();
        gameActive = true;
        startBtn.disabled = true;
        gameInterval = setInterval(createDrop, 1000);
    }

    function endGame() {
        finalScoreDisplay.textContent = score;
        gameOverPrompt.classList.remove('hidden');
        gameActive = false;
        clearInterval(gameInterval);
    }

    function resetGame() {
        score = 0;
        dirtyDropletCount = 0;
        updateScore();
        const gameContainer = document.getElementById('game-container');
        while (gameContainer.firstChild) {
            gameContainer.removeChild(gameContainer.firstChild);
        }
    }

    function updateScore() {
        scoreDisplay.textContent = score;
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
        
        // Randomly determine if this drop is good or bad (20% chance of bad)
        const isBadDrop = Math.random() < 0.2;
        drop.className = isBadDrop ? 'water-drop bad-drop' : 'water-drop';
        
        // Create random size variation for visual interest
        const scale = 0.8 + Math.random() * 0.7;  // Results in 80% to 150% of original size
        drop.style.transform = `scale(${scale})`;
        
        // Position drop randomly along the width of the game container
        const gameWidth = document.getElementById('game-container').offsetWidth;
        const randomX = Math.random() * (gameWidth - 40);
        drop.style.left = `${randomX}px`;
        
        // Set drop animation speed
        drop.style.animationDuration = '4s';
        
        // Click handler to collect drops
        drop.addEventListener('click', () => {
            drop.remove();
            if (isBadDrop) {
                collectDirtyDroplet();
            } else {
                collectCleanDroplet();
            }
        });
        
        // Add drop to game container
        document.getElementById('game-container').appendChild(drop);
        
        // Remove drop if it reaches bottom without being clicked
        drop.addEventListener('animationend', () => {
            drop.remove();
            if (isBadDrop) {
                collectDirtyDroplet();
            }
        });
    }
});

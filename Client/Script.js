const apiUrl = "https://rpslsgame-gycwb0ctbbhveab9.westus3-01.azurewebsites.net/Game/GetCpuChoice";
//*WORKING LINK "https://victorious-meadow-0ca09501e.6.azurestaticapps.net"
// State Variables
let gameMode = 'cpu'; // 'cpu' or 'pvp'
let winsNeeded = 1;
let p1Score = 0;
let p2Score = 0;

// PvP Specific Variables
let currentPlayer = 1;
let p1Choice = ""; 

// --- NAVIGATION FUNCTIONS ---

function goHome() {
    resetScores();
    showScreen('homeScreen');
}

function goToModeSelect(mode) {
    gameMode = mode;
    showScreen('roundScreen');
}

function startGame(rounds) {
    winsNeeded = rounds;
    resetScores();
    currentPlayer = 1; // Always start with P1
    
    // Update Scoreboard labels
    document.getElementById('targetScore').innerText = winsNeeded;
    
    if (gameMode === 'cpu') {
        document.getElementById('p2Name').innerHTML = "CPU: <span id='p2Score'>0</span>";
        document.getElementById('opponentLabel').innerText = "CPU";
        updateInstruction("Choose your move:");
    } else {
        document.getElementById('p2Name').innerHTML = "P2: <span id='p2Score'>0</span>";
        document.getElementById('opponentLabel').innerText = "Player 2";
        updateInstruction("Player 1's Turn - Choose your move:");
    }
    
    showScreen('gameScreen');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    
    const target = document.getElementById(screenId);
    if(target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
}

function updateInstruction(text) {
    document.getElementById('gameInstruction').innerText = text;
}

// --- GAME LOGIC ---

function handleMove(choice) {
    if (gameMode === 'cpu') {
        playCpuRound(choice);
    } else {
        playPvPRound(choice);
    }
}

// 1. CPU MODE
async function playCpuRound(userChoice) {
    try {
        const response = await fetch(apiUrl);
        let cpuChoice = await response.text();
        cpuChoice = cpuChoice.replace(/"/g, '').trim(); 

        const result = checkWinner(userChoice, cpuChoice);
        
        if (result.winner === 'user') p1Score++;
        if (result.winner === 'cpu') p2Score++;

        displayResult(userChoice, cpuChoice, result);

    } catch (error) {
        console.error(error);
        alert("API Error! Using random backup.");
        const choices = ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock'];
        const random = choices[Math.floor(Math.random() * choices.length)];
        displayResult(userChoice, random, checkWinner(userChoice, random));
    }
}

// 2. PvP MODE
function playPvPRound(choice) {
    if (currentPlayer === 1) {
        // Player 1 finished.
        p1Choice = choice;
        currentPlayer = 2;
        
        // Show "Pass Device" screen
        document.getElementById('nextPlayerName').innerText = "Player 2";
        showScreen('transitionScreen');
        
    } else {
        // Player 2 finished.
        const p2Choice = choice;
        const result = checkWinner(p1Choice, p2Choice);
        
        if (result.winner === 'user') p1Score++; 
        if (result.winner === 'cpu') p2Score++;  
        
        // Show Result
        displayResult(p1Choice, p2Choice, result);
    }
}

function startTurn() {
    updateInstruction(`Player ${currentPlayer}'s Turn - Choose your move:`);
    showScreen('gameScreen');
}

function displayResult(p1Move, p2Move, resultData) {
    // Update Images
    document.getElementById("userChoiceDisplay").innerHTML = getImgTag(p1Move);
    document.getElementById("cpuChoiceDisplay").innerHTML = getImgTag(p2Move);

    // Update Text
    document.getElementById("winnerText").innerText = resultData.title;
    document.getElementById("reasonText").innerText = resultData.message;

    // Update Scoreboard Numbers
    document.getElementById("p1Score").innerText = p1Score;
    document.getElementById("p2Score").innerText = p2Score;

    showScreen("resultScreen");
}

function nextRound() {
    // Check if match is over
    if (p1Score >= winsNeeded) {
        const winnerName = (gameMode === 'cpu') ? "You" : "Player 1";
        alert(`CONGRATULATIONS! ${winnerName} won the match!`);
        goHome();
    } else if (p2Score >= winsNeeded) {
        const winnerName = (gameMode === 'cpu') ? "CPU" : "Player 2";
        alert(`GAME OVER! ${winnerName} won the match!`);
        goHome();
    } else {
        // Reset for next round
        currentPlayer = 1;
        if (gameMode === 'pvp') {
            updateInstruction("Player 1's Turn - Choose your move:");
        } else {
            updateInstruction("Choose your move:");
        }
        showScreen("gameScreen");
    }
}

function resetScores() {
    p1Score = 0;
    p2Score = 0;
    currentPlayer = 1;
    document.getElementById("p1Score").innerText = 0;
    document.getElementById("p2Score").innerText = 0;
}

// --- HELPER LOGIC ---

function checkWinner(p1, p2) {
    p1 = p1.toLowerCase();
    p2 = p2.toLowerCase();

    if (p1 === p2) return { title: "It's a Tie!", message: "Great minds think alike.", winner: 'draw' };

    // Standard Win Logic
    if (
        (p1 === "rock" && (p2 === "scissors" || p2 === "lizard")) ||
        (p1 === "paper" && (p2 === "rock" || p2 === "spock")) ||
        (p1 === "scissors" && (p2 === "paper" || p2 === "lizard")) ||
        (p1 === "lizard" && (p2 === "spock" || p2 === "paper")) ||
        (p1 === "spock" && (p2 === "scissors" || p2 === "rock"))
    ) {
        // P1 Wins
        return { title: "Player 1 Wins!", message: `${capitalize(p1)} beats ${capitalize(p2)}`, winner: 'user' };
    }

    // P2 (or CPU) Wins
    const p2Name = (gameMode === 'cpu') ? "CPU" : "Player 2";
    return { title: `${p2Name} Wins!`, message: `${capitalize(p2)} beats ${capitalize(p1)}`, winner: 'cpu' };
}

function getImgTag(choice) {
    return `<img src="./Photos/${choice}.png" alt="${choice}" class="result-img" onerror="this.src='./Photos/${choice.toLowerCase()}.png'">`;
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// --- EVENT LISTENERS ---

// 1. Home Screen Buttons
document.getElementById('btnCpu').addEventListener('click', function() {
    goToModeSelect('cpu');
});

document.getElementById('btnPvp').addEventListener('click', function() {
    goToModeSelect('pvp');
});

document.getElementById('btnRules').addEventListener('click', function() {
    showScreen('rulesScreen');
});

// 2. Rules Screen Buttons
document.getElementById('btnHomeRules').addEventListener('click', function() {
    goHome();
});


// 3. Round Selection Buttons
document.getElementById('btnBest1').addEventListener('click', function() {
    startGame(1);
});
document.getElementById('btnBest3').addEventListener('click', function() {
    startGame(3);
});
document.getElementById('btnBest4').addEventListener('click', function() {
    startGame(4);
});
document.getElementById('btnBackRounds').addEventListener('click', function() {
    goHome();
});

// 4. Transition Screen Button
document.getElementById('btnReady').addEventListener('click', function() {
    startTurn();
});

// 5. Game Buttons 
document.getElementById('btnRock').addEventListener('click', function() {
    handleMove('Rock');
});
document.getElementById('btnPaper').addEventListener('click', function() {
    handleMove('Paper');
});
document.getElementById('btnScissors').addEventListener('click', function() {
    handleMove('Scissors');
});
document.getElementById('btnLizard').addEventListener('click', function() {
    handleMove('Lizard');
});
document.getElementById('btnSpock').addEventListener('click', function() {
    handleMove('Spock');
});


document.getElementById('btnNextRound').addEventListener('click', function() {
    nextRound();
});

document.getElementById('btnQuit').addEventListener('click', function() {
    goHome();
});
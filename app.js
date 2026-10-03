// State Management
let selectedCards = [];
let countdownTime = 49;
let gameId = 1;
let timerInterval = null;

// Wallet configs based on settings
const mainWalletVal = 0;
const playWalletVal = 10;

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    initWallets();
    generateCartelaGrid();
    startCountdown();
    setupBingoColumnsBoard();
});

// Sync wallets across UI
function initWallets() {
    document.getElementById('top-main-wallet').innerText = mainWalletVal;
    document.getElementById('top-play-wallet').innerText = playWalletVal;
    document.getElementById('wallet-main').innerText = mainWalletVal;
    document.getElementById('wallet-play').innerText = playWalletVal;
    document.getElementById('prof-main').innerText = mainWalletVal;
    document.getElementById('prof-play').innerText = playWalletVal;
}

// 1ኛ. Create 1-600 Taller Cartela Boxes
function generateCartelaGrid() {
    const grid = document.getElementById('cartela-grid');
    grid.innerHTML = '';
    for (let i = 1; i <= 600; i++) {
        const box = document.createElement('div');
        box.className = 'cartela-box';
        box.innerText = i;
        box.onclick = () => selectCartela(box, i);
        grid.appendChild(box);
    }
}

function selectCartela(element, cardNumber) {
    if (selectedCards.includes(cardNumber)) {
        selectedCards = selectedCards.filter(id => id !== cardNumber);
        element.classList.remove('selected');
    } else {
        if (selectedCards.length >= 3) {
            alert("ቢበዛ መምረጥ የሚችሉት 3 ካርቴላ ብቻ ነው!");
            return;
        }
        selectedCards.push(cardNumber);
        element.classList.add('selected');
    }
}

// 2ኛ & Navigation Switcher
function switchView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(view-${viewName}).classList.add('active');
    
    // Highlight correct nav item
    const navItems = document.querySelectorAll('.nav-item');
    if(viewName === 'game') navItems[0].classList.add('active');
    if(viewName === 'wallet') navItems[1].classList.add('active');
    if(viewName === 'history') navItems[2].classList.add('active');
    if(viewName === 'profile') navItems[3].classList.add('active');
}

// 3ኛ. Countdown Timer (From 49 down to 0)
function startCountdown() {
    countdownTime = 49;
    document.getElementById('timer-display').innerText = countdownTime + "s";
    
    // Ensure standard game setup view is reset
    document.getElementById('stage-selection').style.display = 'block';
    document.getElementById('stage-live').style.display = 'none';

    timerInterval = setInterval(() => {
        countdownTime--;
        document.getElementById('timer-display').innerText = countdownTime + "s";

        if (countdownTime <= 0) {
            clearInterval(timerInterval);
            // 4ኛ. Switch whole page style dynamically to Live game
            transitionToLiveGame();
        }
    }, 1000);
}

// 4ኛ. Full screen stage change when countdown hits 0
function transitionToLiveGame() {
    document.getElementById('stage-selection').style.display = 'none';
    document.getElementById('stage-live').style.display = 'block';
    
    // Format Game ID into 0001, 0002 pattern
    let formattedGameId = String(gameId).padStart(4, '0');
    document.getElementById('live-game-id').innerText = formattedGameId;
    
    startBingoCalling();
}

// 5ኛ. Bingo numbers column definitions & calling mechanism
const columnsConfig = {
    'B': { min: 1, max: 15 },
    'I': { min: 16, max: 30 },
    'N': { min: 31, max: 45 },
    'G': { min: 46, max: 60 },
    'O': { min: 61, max: 75 }
};

function setupBingoColumnsBoard() {
const panel = document.getElementById('bingo-columns-board');
    panel.innerHTML = '';
    
    Object.keys(columnsConfig).forEach(letter => {
        const colDiv = document.createElement('div');
        colDiv.className = 'column-list';
        
        const header = document.createElement('div');
        header.className = 'column-header';
        header.innerText = letter;
        colDiv.appendChild(header);
        
        for(let i = columnsConfig[letter].min; i <= columnsConfig[letter].max; i++) {
            const numSpan = document.createElement('span');
            numSpan.className = 'called-list-num';
            numSpan.id = num-${letter}-${i};
            numSpan.innerText = i;
            colDiv.appendChild(numSpan);
        }
        panel.appendChild(colDiv);
    });
}

function startBingoCalling() {
    let pool = [];
    // Generate all available bingo calls
    Object.keys(columnsConfig).forEach(letter => {
        for(let i = columnsConfig[letter].min; i <= columnsConfig[letter].max; i++) {
            pool.push({ letter: letter, num: i });
        }
    });

    // Shuffle array
    pool = pool.sort(() => Math.random() - 0.5);

    let callIndex = 0;
    let callInterval = setInterval(() => {
        if (callIndex >= pool.length || countdownTime > 0) { 
            clearInterval(callInterval);
            // After calling sequence finished, advance game id and loop game back
            gameId++;
            setTimeout(() => { startCountdown(); }, 5000); // 5 sec break before next game
            return;
        }

        let currentCall = pool[callIndex];
        // Render call to live small screen display
        document.getElementById('live-called-num').innerText = ${currentCall.letter} - ${currentCall.num};
        
        // Highlight in the specific column list
        const targetElement = document.getElementById(num-${currentCall.letter}-${currentCall.num});
        if(targetElement) {
            targetElement.classList.add('active');
        }

        callIndex++;
    }, 3000); // Calls numbers every 3 seconds
}
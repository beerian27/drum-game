// Constants
const keys = ['w', 'a', 's', 'd', 'j', 'k', 'l'];
const winText = 'You Won! 🥳';
const loseText = 'You Lost! 😔';
const yourTurnText = 'Your Turn! ☝🏻'
const startGameText = 'Start Game';
const playAgainText = 'Play Again';
const memorizeText = 'Memorize This Sequence 🤔';
const rulesText = 'Rules: Repeat the Sequence!'
const randomText = '🤟🏻🎵🎼'

// Variable that holds the state of the game
let gameState = {
    numberOfSounds: 6,
    state: 'off',
    keyOrder: [],
    turn: null,
    keyNo: 0,
    score: 0,
    speed: 1000
}

// All HTML elements we are concerned with
let userFeedbackText = document.querySelector('#user-feedback');
let playBtn = document.querySelector('#play-btn');
let randomBtn = document.querySelector('#random-btn');
let scoreText = document.querySelector('#score');
let drumBtns = document.querySelectorAll('.drum');
let speedSetting = document.querySelector('#speed-range');
let countSetting = document.querySelector('#count-range');
let speedSettingLabel = document.querySelector('#speed-setting');
let countSettingLabel = document.querySelector('#count-setting');

// On load actions
window.addEventListener("load", (event) => {
    // Populate slider setting labels
    document.querySelector('#score').innerHTML = gameState.score;
    countSettingLabel.innerHTML = gameState.numberOfSounds;

    // On click of each drum, manipulate game state, play sounds and alter colours
    drumBtns.forEach((drumBtn) => {
        drumBtn.addEventListener('click', () => {
            if (gameState.turn != 'pc') {
                if (keys.includes(drumBtn.innerHTML)) {
                    if (gameState.state == 'on' && gameState.turn == 'user') {
                        if (drumBtn.innerHTML != gameState.keyOrder[gameState.keyNo]) {
                            setLost();
                        } else {
                            if (gameState.keyNo == gameState.numberOfSounds - 1) {
                                setWin();
                            } else {
                                progressGame();
                            }
                        }
                    }
                    playSound(drumBtn.innerHTML);
                    setColor(drumBtn.innerHTML, 'click');
                }
            }
        })
    });

    // On keydown for each drum, manipulate game state, play sounds and alter colours
    addEventListener('keydown', (e) => {
        if (gameState.turn != 'pc') {
            if (keys.includes(e.key)) {
                if (gameState.state == 'on' && gameState.turn == 'user') {
                    if (e.key != gameState.keyOrder[gameState.keyNo]) {
                        setLost();
                    } else {
                        if (gameState.keyNo == gameState.numberOfSounds - 1) {
                            setWin();
                        } else {
                            progressGame();
                        }
                    }
                }
                playSound(e.key);
                setColor(e.key, e.type);
            }
        }
    });

    // On keyup of each drum, reset colours
    addEventListener('keyup', (e) => {
        if (keys.includes(e.key)) {
            setColor(e.key, e.type);
        }
    });

    // On input change of speed slider, update game state and update label
    speedSetting.addEventListener('input', (e) => {
        let difficultyText;
        let speed;
        
        switch (e.target.value) {
            case '1':
                difficultyText = 'Very Easy';
                speed = 1000;
                break;
            case '2':
                difficultyText = 'Easy';
                speed = 750;
                break;
            case '3':
                difficultyText = 'Moderate';
                speed = 500;
                break;
            case '4':
                difficultyText = 'Hard';
                speed = 250;
                break;
            case '5':
                difficultyText = 'Very Hard';
                speed = 100;
                break;
            default:
                break;
        }
        gameState = {
            ...gameState,
            speed: speed
        };
        speedSettingLabel.innerHTML = difficultyText;
        console.log(gameState);
    });

    // On input change of count slider, update game state and update label
    countSetting.addEventListener('input', (e) => {
        gameState = {
            ...gameState,
            numberOfSounds: parseInt(e.target.value)
        };
        document.querySelector('#count-setting').innerHTML = e.target.value;
    })
});

// Function that changes the colour of the drum set when they are pressed
let setColor = (key, event) => {
    let drumElement = document.querySelector('.' + key);
    if (event == 'keydown') {
        drumElement.style.color = 'white';
        drumElement.classList.add('pressed');
    } else if (event == 'keyup') {
        drumElement.classList.remove('pressed');
        drumElement.removeAttribute('style');
    } else {
        drumElement.classList.add('pressed');
        drumElement.style.color = 'white';

        setTimeout(() => {
            drumElement.classList.remove('pressed');
            drumElement.removeAttribute('style');
        }, 50)
    }
}

// Function that plays the according sound to each key
let playSound = (key) => {
    let audio = new Audio();
    switch (key) {
        case 'w':
            audio.src = ('./sounds/crash.mp3');
            break;
        case 'a':
            audio.src = ('./sounds/kick-bass.mp3');
            break;
        case 's':
            audio.src = ('./sounds/snare.mp3');
            break;
        case 'd':
            audio.src = ('./sounds/tom-1.mp3');
            break;
        case 'j':
            audio.src = ('./sounds/tom-2.mp3');
            break;
        case 'k':
            audio.src = ('./sounds/tom-3.mp3');
            break;
        case 'l':
            audio.src = ('./sounds/tom-4.mp3');
            break;
        default:
            break;
    }
    if (audio.src) {
        audio.play();
    }
}

// Event handler for when the play button is pressed/clicked
let startGame = async () => {
    countSetting.disabled = true;
    speedSetting.disabled = true;
    playBtn.style.visibility = 'hidden';
    randomBtn.style.visibility = 'hidden';
    gameState.turn = 'pc';
    gameState.state = 'on';
    let keyOrder = [];
    userFeedbackText.innerHTML = memorizeText;
    userFeedbackText.style.visibility = 'visible';
    for (let i = 1; i < gameState.numberOfSounds + 1; i++) {
        keyOrder.push(await playSoundAfterDelay(gameState.speed));
    }
    gameState.turn = 'user';
    gameState.keyOrder = keyOrder;
    userFeedbackText.innerHTML = yourTurnText;
    console.log(keyOrder);
    console.log(gameState);
}

// Event handler for when the random button is pressed/clicked
let randomBeat = async () => {
    let stateBackup = {...gameState};
    countSetting.disabled = true;
    speedSetting.disabled = true;
    playBtn.style.visibility = 'hidden';
    randomBtn.style.visibility = 'hidden';
    gameState.turn = 'pc';
    gameState.state = 'random';
    gameState.numberOfSounds = 30;
    gameState.speed = 100;
    userFeedbackText.innerHTML = randomText;
    userFeedbackText.style.visibility = 'visible';
    for (let i = 1; i < gameState.numberOfSounds + 1; i++) {
        await playSoundAfterDelay(gameState.speed);
    }
    resetGame(stateBackup);
}

// Helper function to delay for loop and play sounds, set colours
let playSoundAfterDelay = (ms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            randomNum = Math.floor(Math.random() * 7);
            let key = keys[randomNum];
            playSound(key);
            setColor(key, null);
            resolve(key);
        }, ms);
    })
}

// Set the game state to reset, indicate loss
let setLost = () => {
    gameState = {
        ...gameState,
        keyNo: 0,
        turn: null,
        state: 'off',
        keyOrder: []
    };
    userFeedbackText.innerHTML = loseText;
    scoreText.innerHTML = gameState.score;
    playBtn.innerHTML = playAgainText;
    playBtn.style.visibility = 'visible';
    randomBtn.style.visibility = 'visible';
    speedSetting.disabled = false;
    countSetting.disabled = false;
}

// Set the game state to reset, increment the score, indicate win
let setWin = () => {
    gameState = {
        ...gameState,
        keyNo: 0,
        turn: null,
        state: 'off',
        keyOrder: [],
        score: ++gameState.score
    };
    userFeedbackText.innerHTML = winText;
    playBtn.innerHTML = playAgainText;
    playBtn.style.visibility = 'visible';
    randomBtn.style.visibility = 'visible';
    scoreText.innerHTML = gameState.score;
    speedSetting.disabled = false;
    countSetting.disabled = false;
}

// Reset game after random beat
let resetGame = (backup) => {
    gameState = backup;
    playBtn.style.visibility = 'visible';
    randomBtn.style.visibility = 'visible';
    userFeedbackText.innerHTML = rulesText;
    speedSetting.disabled = false;
    countSetting.disabled = false;
}

// Progress the game as a user hits a drum
let progressGame = () => {
    gameState = {
        ...gameState,
        keyNo: ++gameState.keyNo
    };
}
'use strict';

// Declaración de variables globales
var playerForm, playerNameInput, timerSelect, gameBoard, timerElement, scoreElement, currentWordElement, wordListElement, endGameButton, boardElement, deleteWordButton, validateWordButton, shuffleBoardButton, messageElement;
var game = {
    timer: null,
    timeLeft: 180,
    score: 0,
    currentWord: '',
    currentWordPath: [],
    wordsFound: [],
    playerName: '',
    board: []
};

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', init);

function init() {
    playerForm = document.getElementById('player-form');
    playerNameInput = document.getElementById('player-name');
    timerSelect = document.getElementById('timer-select');
    gameBoard = document.getElementById('game-board');
    timerElement = document.getElementById('timer');
    scoreElement = document.getElementById('score');
    currentWordElement = document.getElementById('current-word');
    wordListElement = document.getElementById('word-list');
    endGameButton = document.getElementById('end-game');
    boardElement = document.getElementById('board');
    deleteWordButton = document.getElementById('delete-word');
    validateWordButton = document.getElementById('validate-word');
    shuffleBoardButton = document.getElementById('shuffle-board');
    messageElement = document.getElementById('message');

    playerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        startGame();
    });
    deleteWordButton.addEventListener('click', deleteWord);
    validateWordButton.addEventListener('click', function() {
        validateWord(game.currentWord);
    });
    shuffleBoardButton.addEventListener('click', shuffleBoard);
    endGameButton.addEventListener('click', endGame);

    resetGame();
}

// Función para generar un tablero de letras aleatorias
function generateBoard() {
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var board = [];
    for (var i = 0; i < 16; i++) {
        board.push(letters.charAt(Math.floor(Math.random() * letters.length)));
    }
    return board;
}

// Función para mezclar el tablero
function shuffleBoard() {
    for (var i = game.board.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = game.board[i];
        game.board[i] = game.board[j];
        game.board[j] = temp;
    }
    updateBoard();
}

// Función para iniciar el juego
function startGame() {
    game.playerName = playerNameInput.value;
    if (game.playerName.length < 3) {
        showMessage('El nombre debe tener al menos 3 letras.');
        return;
    }
    game.timeLeft = parseInt(timerSelect.value);
    playerForm.style.display = 'none';
    gameBoard.classList.remove('hidden');
    game.score = 0;
    game.currentWord = '';
    game.currentWordPath = [];
    game.wordsFound = [];
    game.board = generateBoard();
    updateBoard();
    updateTimer();
    game.timer = setInterval(updateTimer, 1000);
}

// Función para actualizar el tablero en el DOM
function updateBoard() {
    boardElement.innerHTML = '';
    for (var i = 0; i < game.board.length; i++) {
        var cell = document.createElement('div');
        cell.textContent = game.board[i];
        cell.dataset.index = i;
        cell.classList.add('board-cell');
        cell.addEventListener('click', function() {
            selectLetter(this.textContent, parseInt(this.dataset.index));
        });
        boardElement.appendChild(cell);
    }
}

// Función para seleccionar una letra en el tablero
function selectLetter(letter, index) {
    if (game.currentWordPath.length === 0 || isValidSelection(index)) {
        game.currentWord += letter;
        game.currentWordPath.push(index);
        currentWordElement.textContent = game.currentWord;
        document.querySelector('[data-index="' + index + '"]').classList.add('selected');
        updateSelectableLetters(index);
    }
}

// Función para validar si la selección de una letra es correcta
function isValidSelection(index) {
    var lastIndex = game.currentWordPath[game.currentWordPath.length - 1];
    var validMoves = [
        lastIndex - 5, lastIndex - 4, lastIndex - 3,
        lastIndex - 1, lastIndex + 1,
        lastIndex + 3, lastIndex + 4, lastIndex + 5
    ];
    return validMoves.indexOf(index) !== -1 && game.currentWordPath.indexOf(index) === -1;
}

// Función para actualizar las letras seleccionables
function updateSelectableLetters(lastIndex) {
    clearSelectableCells();
    var validMoves = [
        lastIndex - 5, lastIndex - 4, lastIndex - 3,
        lastIndex - 1, lastIndex + 1,
        lastIndex + 3, lastIndex + 4, lastIndex + 5
    ];

    for (var i = 0; i < validMoves.length; i++) {
        var index = validMoves[i];
        if (index >= 0 && index < 16 && game.currentWordPath.indexOf(index) === -1) {
            document.querySelector('[data-index="' + index + '"]').classList.add('selectable');
        }
    }
}

// Función para limpiar las celdas seleccionables
function clearSelectableCells() {
    var cells = document.querySelectorAll('.board-cell');
    for (var i = 0; i < cells.length; i++) {
        cells[i].classList.remove('selectable');
    }
}

// Función para calcular el puntaje basado en la longitud de la palabra
function calculateScore(length) {
    if (length >= 8) return 11;
    if (length === 7) return 5;
    if (length === 6) return 3;
    if (length === 5) return 2;
    if (length === 3 || length === 4) return 1;
    return 0;
}

// Función para validar la palabra
function validateWord(word) {
    if (word.length < 3) {
        showMessage('La palabra debe tener al menos 3 letras.');
        deleteWordButton.click();
        return;
    }

    if (game.wordsFound.indexOf(word) !== -1) {
        showMessage('Esta palabra ya ha sido encontrada.');
        deleteWordButton.click();
        return;
    }

    fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.title !== 'No Definitions Found') {
                game.wordsFound.push(word);
                game.score += calculateScore(word.length);
                scoreElement.textContent = 'Puntaje: ' + game.score;
                wordListElement.innerHTML += '<li>' + word + '</li>';
                game.currentWord = '';
                game.currentWordPath = [];
                currentWordElement.textContent = '';
                clearSelectedCells();
                showMessage('Palabra válida', 'success');
            } else {
                game.score -= 1;
                scoreElement.textContent = 'Puntaje: ' + game.score;
                showMessage('Palabra no válida');
                deleteWordButton.click();
            }
        })
        .catch(function(error) {
            console.error('Error al validar la palabra:', error);
            showMessage('Error al validar la palabra');
        });
}

// Función para eliminar la palabra actual
function deleteWord() {
    game.currentWord = '';
    game.currentWordPath = [];
    currentWordElement.textContent = '';
    clearSelectedCells();
}

// Función para limpiar las celdas seleccionadas
function clearSelectedCells() {
    var cells = document.querySelectorAll('.board-cell');
    for (var i = 0; i < cells.length; i++) {
        cells[i].classList.remove('selected');
    }
}

// Función para actualizar el temporizador
function updateTimer() {
    if (game.timeLeft <= 0) {
        clearInterval(game.timer);
        endGame();
    } else {
        timerElement.textContent = 'Tiempo: ' + game.timeLeft + 's';
        game.timeLeft--;
    }
}

// Función para finalizar el juego
function endGame() {
    localStorage.setItem('playerName', game.playerName);
    localStorage.setItem('score', game.score);
    window.location.href = 'gameover.html';
}

// Función para reiniciar el juego
function resetGame() {
    clearInterval(game.timer);
    game.timeLeft = 180;
    game.score = 0;
    game.currentWord = '';
    game.currentWordPath = [];
    game.wordsFound = [];
    game.board = generateBoard();
    updateBoard();
    scoreElement.textContent = 'Puntaje: 0';
    wordListElement.innerHTML = '';
    currentWordElement.textContent = '';
    playerForm.style.display = 'flex';
    gameBoard.classList.add('hidden');
    messageElement.textContent = '';
}

// Función para mostrar mensajes
function showMessage(message, type) {
    if (typeof type === 'undefined') { type = 'error'; }
    messageElement.textContent = message;
    messageElement.className = type;
}
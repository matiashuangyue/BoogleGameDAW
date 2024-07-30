document.addEventListener('DOMContentLoaded', function() {
    var playerForm = document.getElementById('player-form');
    var playerNameInput = document.getElementById('player-name');
    var gameBoard = document.getElementById('game-board');
    var timerElement = document.getElementById('timer');
    var scoreElement = document.getElementById('score');
    var currentWordElement = document.getElementById('current-word');
    var wordListElement = document.getElementById('word-list');
    var endGameButton = document.getElementById('end-game');
    var boardElement = document.getElementById('board');
    var deleteWordButton = document.getElementById('delete-word');
    var validateWordButton = document.getElementById('validate-word');
    var shuffleBoardButton = document.getElementById('shuffle-board');
    var messageElement = document.getElementById('message');

    var game = {
        timer: null,
        timeLeft: 180,
        score: 0,
        currentWord: '',
        currentWordPath: [],
        wordsFound: [],
        playerName: '',
        board: generateBoard()
    };

    // Función para generar el tablero de letras
    function generateBoard() {
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var board = [];
        for (var i = 0; i < 16; i++) { // Tablero de 4x4
            board.push(letters.charAt(Math.floor(Math.random() * letters.length)));
        }
        return board;
    }

    // Función para mezclar el tablero
    function shuffleBoard() {
        for (let i = game.board.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [game.board[i], game.board[j]] = [game.board[j], game.board[i]];
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

        // Ocultar el formulario del nombre del jugador y mostrar el tablero del juego
        playerForm.style.display = 'none';
        gameBoard.classList.remove('hidden');

        game.timeLeft = 180;
        game.score = 0;
        game.currentWord = '';
        game.currentWordPath = [];
        game.wordsFound = [];
        game.board = generateBoard(); // Generar un nuevo tablero cada vez que se inicia el juego
        updateBoard();
        updateTimer();
        game.timer = setInterval(updateTimer, 1000);
    }

    // Función para actualizar el tablero
    function updateBoard() {
        boardElement.innerHTML = '';
        game.board.forEach(function(letter, index) {
            var cell = document.createElement('div');
            cell.textContent = letter;
            cell.dataset.index = index;
            cell.classList.add('board-cell'); // Añadir la clase board-cell
            cell.addEventListener('click', function() {
                selectLetter(letter, index);
            });
            boardElement.appendChild(cell);
        });
    }

    // Función para seleccionar una letra en el tablero
    function selectLetter(letter, index) {
        if (game.currentWordPath.length === 0 || isValidSelection(index)) {
            game.currentWord += letter;
            game.currentWordPath.push(index);
            currentWordElement.textContent = game.currentWord;
            document.querySelector(`[data-index='${index}']`).classList.add('selected');
        }
    }

    // Función para validar si la selección de una letra es correcta
    function isValidSelection(index) {
        var lastIndex = game.currentWordPath[game.currentWordPath.length - 1];
        var validMoves = [
            lastIndex - 5, lastIndex - 4, lastIndex - 3, // Fila anterior
            lastIndex - 1, lastIndex + 1,               // Misma fila
            lastIndex + 3, lastIndex + 4, lastIndex + 5 // Siguiente fila
        ];
        return validMoves.includes(index) && !game.currentWordPath.includes(index);
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

        if (game.wordsFound.includes(word)) {
            showMessage('Esta palabra ya ha sido encontrada.');
            deleteWordButton.click(); // Eliminar la palabra si ya ha sido encontrada
            return;
        }

        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => response.json())
            .then(data => {
                if (data.title !== 'No Definitions Found') {
                    game.wordsFound.push(word);
                    game.score += calculateScore(word.length);
                    scoreElement.textContent = 'Puntaje: ' + game.score;
                    wordListElement.innerHTML += `<li>${word}</li>`;
                    game.currentWord = '';
                    game.currentWordPath = [];
                    currentWordElement.textContent = '';
                    clearSelectedCells();
                    showMessage('Palabra válida', 'success');
                } else {
                    showMessage('Palabra no válida');
                    deleteWordButton.click(); // Eliminar la palabra si no es válida
                }
            })
            .catch(error => {
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
        cells.forEach(cell => cell.classList.remove('selected'));
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

    // Event listener para iniciar el juego al enviar el formulario
    playerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        startGame();
    });

    // Event listeners para los botones de eliminar palabra, validar palabra y mezclar tablero
    deleteWordButton.addEventListener('click', deleteWord);
    validateWordButton.addEventListener('click', function() {
        validateWord(game.currentWord);
    });
    shuffleBoardButton.addEventListener('click', shuffleBoard);
    endGameButton.addEventListener('click', endGame);

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
        playerForm.style.display = 'flex'; // Mostrar el formulario nuevamente
        gameBoard.classList.add('hidden');
        messageElement.textContent = ''; // Limpiar el mensaje
    }

    // Función para mostrar mensajes
    function showMessage(message, type = 'error') {
        messageElement.textContent = message;
        messageElement.className = type;
    }
});

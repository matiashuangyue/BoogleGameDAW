'use strict';
// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtiene referencias a los elementos del DOM por sus IDs
    var playerForm = document.getElementById('player-form');
    var playerNameInput = document.getElementById('player-name');
    var timerSelect = document.getElementById('timer-select');
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

    
    // Función para generar un tablero de letras aleatorias
    function generateBoard() {
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var board = [];
        for (var i = 0; i < 16; i++) { 
            board.push(letters.charAt(Math.floor(Math.random() * letters.length)));
        }
        return board;
    }
     
    var game = {
        timer: null,
        timeLeft: 180, // 3 minutos en segundos por defecto
        score: 0,
        currentWord: '', // Palabra actual
        currentWordPath: [], // Camino de la palabra actual
        wordsFound: [], // Palabras encontradas
        playerName: '',
        board: generateBoard() // Tablero de letras
    };



    // Función para limpiar las celdas seleccionadas
    function clearSelectedCells() {
        var cells = document.querySelectorAll('.board-cell'); // Obtiene todas las celdas del tablero
        cells.forEach(function(cell) {
            cell.classList.remove('selected');
        }); // Elimina la clase 'selected' de cada celda
    }


    // Función para limpiar las celdas seleccionables
    function clearSelectableCells() {
        var cells = document.querySelectorAll('.board-cell');
        for (var i = 0; i < cells.length; i++) {
            cells[i].classList.remove('selectable');
                }
    }

    // Función para actualizar las letras seleccionables
    function updateSelectableLetters(lastIndex) {
        clearSelectableCells();
        var validMoves = [];
        var row = Math.floor(lastIndex / 4); // Obtiene la fila actual
        var col = lastIndex % 4; // Obtiene la columna actual

        // Movimientos válidos en la misma fila
        if (col > 0) validMoves.push(lastIndex - 1);
        if (col < 3) validMoves.push(lastIndex + 1);

        // Movimientos válidos en la fila anterior
        if (row > 0) {
            if (col > 0) validMoves.push(lastIndex - 5);
            validMoves.push(lastIndex - 4);
            if (col < 3) validMoves.push(lastIndex - 3);
        }

        // Movimientos válidos en la fila siguiente
        if (row < 3) {
            if (col > 0) validMoves.push(lastIndex + 3);
            validMoves.push(lastIndex + 4);
            if (col < 3) validMoves.push(lastIndex + 5);
        }

        validMoves.forEach(function(index) {
            if (index >= 0 && index < 16 && game.currentWordPath.indexOf(index) === -1) {
                document.querySelector(`[data-index='${index}']`).classList.add('selectable');
            }
        });
    }
    
    // Función para actualizar el tablero en el DOM
    function updateBoard() {
        boardElement.innerHTML = ''; // Limpia el tablero
        game.board.forEach(function(letter, index) {//callback function
            var cell = document.createElement('div');
            cell.textContent = letter; 
            cell.dataset.index = index; // Establece el índice de la celda
            cell.classList.add('board-cell'); // Añade la clase board-cell para aplicar estilos
            cell.addEventListener('click', function() {
                selectLetter(letter, index); // Añade el event listener para seleccionar la letra
            });
            boardElement.appendChild(cell); // Añade la celda al tablero
        });
    }

    

    // Función para mezclar el tablero
    function shuffleBoard() {
        for (let i = game.board.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            // Intercambia el elemento en la posición i con el elemento en la posición j
            [game.board[i], game.board[j]] = [game.board[j], game.board[i]];
        }
        // Actualiza el tablero
        updateBoard();
        clearSelectedCells();
        clearSelectableCells();
        game.currentWord = '';
        game.currentWordPath = [];
        deleteWordButton.click();
    }   

    function resetGameState() {
        game.score = 0;
        game.currentWord = '';
        game.currentWordPath = [];
        game.wordsFound = [];
    }
  // Función para seleccionar una letra en el tablero
    function selectLetter(letter, index) {
        if (game.currentWordPath.length === 0 || isValidSelection(index)) {
            game.currentWord += letter; // Añade la letra a la palabra actual
            game.currentWordPath.push(index); // Añade el índice al camino de la palabra actual
            currentWordElement.textContent = game.currentWord; // Actualiza la palabra actual en el DOM
            document.querySelector(`[data-index='${index}']`).classList.add('selected'); // Marca la celda como seleccionada
            updateSelectableLetters(index); // Actualiza las letras seleccionables
        }
    }
   
    
    // Función para validar si la selección de una letra es correcta
function isValidSelection(index) {
    var lastIndex = game.currentWordPath[game.currentWordPath.length - 1]; // Obtiene el último índice
    var validMoves = [];
    var row = Math.floor(lastIndex / 4); // Obtiene la fila actual
    var col = lastIndex % 4; // Obtiene la columna actual

    // Movimientos válidos en la misma fila
    if (col > 0) validMoves.push(lastIndex - 1);
    if (col < 3) validMoves.push(lastIndex + 1);

    // Movimientos válidos en la fila anterior
    if (row > 0) {
        if (col > 0) validMoves.push(lastIndex - 5);
        validMoves.push(lastIndex - 4);
        if (col < 3) validMoves.push(lastIndex - 3);
    }

    // Movimientos válidos en la fila siguiente
    if (row < 3) {
        if (col > 0) validMoves.push(lastIndex + 3);
        validMoves.push(lastIndex + 4);
        if (col < 3) validMoves.push(lastIndex + 5);
    }

    // Comprueba si el índice es un movimiento válido y no está en el camino actual
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
                    scoreElement.textContent = 'Puntaje: ' + game.score; // Actualiza el puntaje en el DOM
                    wordListElement.innerHTML += `<li>${word}</li>`; 
                    game.currentWord = ''; // Resetea 
                    game.currentWordPath = []; 
                    currentWordElement.textContent = ''; // Limpia la palabra actual en el DOM
                    clearSelectedCells(); // Limpia las celdas seleccionadas
                    clearSelectableCells(); // Limpia las celdas seleccionables
                    showMessage('Palabra válida', 'success'); 
                } else {
                    game.score -= 1; // Resta un punto por palabra incorrecta
                    scoreElement.textContent = 'Puntaje: ' + game.score; // Actualiza el puntaje en el DOM
                    showMessage('Palabra no válida'); 
                    deleteWordButton.click(); // Elimina la palabra si no es válida
                }
            })
            .catch(error => {
                console.error('Error al validar la palabra:', error); 
                showMessage('Error al validar la palabra'); 
            });
    }

    // Función para eliminar la palabra actual
    function deleteWord() {
        game.currentWord = ''; // Resetea 
        game.currentWordPath = []; 
        currentWordElement.textContent = ''; 
        clearSelectedCells(); 
        clearSelectableCells();
    }

    // Función para actualizar el temporizador
    function updateTimer() {
        if (game.timeLeft <= 0) {
            clearInterval(game.timer); // Detiene el temporizador
            endGame(); // Finaliza el juego
        } else {
            timerElement.textContent = 'Tiempo: ' + game.timeLeft + 's'; // Actualiza el temporizador en el DOM
            game.timeLeft--; // Decrementa el tiempo restante
        }
    }

     // Función para iniciar el juego
     function startGame() {
        game.playerName = playerNameInput.value; // Obtiene el nombre del jugador
        if (game.playerName.length < 3) {
            showMessage('El nombre debe tener al menos 3 letras.');
            return;
        }

        // Obtiene el tiempo seleccionado del temporizador
        game.timeLeft = parseInt(timerSelect.value);
        playerForm.style.display = 'none';
        gameBoard.classList.remove('hidden');

        // Reinicia el estado del juego
        resetGameState();   
        game.board = generateBoard(); // Genera un nuevo tablero cada vez que se inicia el juego
        updateBoard(); 
        updateTimer(); 
        game.timer = setInterval(updateTimer, 1000); // Actualiza el temporizador cada segundo
    }

    // Función para finalizar el juego
    function endGame() {
        // Almacena el puntaje y el nombre del jugador en localStorage
        localStorage.setItem('playerName', game.playerName);
        localStorage.setItem('score', game.score); 

        // Actualiza el ranking
        let rankings = JSON.parse(localStorage.getItem('rankings')) || [];
        rankings.push({ playerName: game.playerName, score: game.score });
        rankings.sort((a, b) => b.score - a.score); // Ordena el ranking de mayor a menor
        if (rankings.length > 10) {
            rankings = rankings.slice(0, 10); // Limita a los 10 mejores jugadores
        }
        localStorage.setItem('rankings', JSON.stringify(rankings));

        window.location.href = 'gameover.html'; 
    }

    // Añade un event listener para iniciar el juego al enviar el formulario
    playerForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el comportamiento por defecto del formulario
        startGame(); 
    });

    // Añade event listeners para los botones de eliminar palabra, validar palabra y mezclar tablero
    deleteWordButton.addEventListener('click', deleteWord);
    validateWordButton.addEventListener('click', function() {
        validateWord(game.currentWord);
        clearSelectableCells();
    });
    shuffleBoardButton.addEventListener('click', shuffleBoard);
    endGameButton.addEventListener('click', endGame);

    // Función para reiniciar el juego
    function resetGame() {
        clearInterval(game.timer); // Detiene el temporizador
        game.timeLeft = 180; 
        game.score = 0; 
        game.currentWord = ''; 
        game.currentWordPath = []; // Resetea la palabra actual y el camino
        game.wordsFound = []; 
        game.board = generateBoard(); 
        updateBoard(); 
        scoreElement.textContent = 'Puntaje: 0';
        wordListElement.innerHTML = ''; 
        currentWordElement.textContent = ''; 
        playerForm.style.display = 'flex'; // Muestra el formulario nuevamente
        gameBoard.classList.add('hidden'); // Oculta el tablero del juego
        messageElement.textContent = ''; 
    }

    // Función para mostrar mensajes
    function showMessage(message, type = 'error') {
        messageElement.textContent = message; // Establece el texto del mensaje
        messageElement.className = type; // Establece la clase del mensaje
    }
});

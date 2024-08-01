// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtiene referencias a los elementos del DOM por sus IDs
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

    // Define el objeto 'game' que contiene el estado del juego
    var game = {
        timer: null,
        timeLeft: 180, // 3 minutos en segundos
        score: 0,
        currentWord: '',// Palabra actual
        currentWordPath: [],// Camino de la palabra actual
        wordsFound: [],// Palabras encontradas
        playerName: '',
        board: generateBoard()// Tablero de letras
    };

    // Función para generar un tablero de letras aleatorias
    function generateBoard() {
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var board = [];
        for (var i = 0; i < 16; i++) { // Tablero de 4x4
            board.push(letters.charAt(Math.floor(Math.random() * letters.length)));// Añade una letra aleatoria al tablero
        }
        return board;// Devuelve el tablero
    }

    // Función para mezclar el tablero
    function shuffleBoard() {
    // Bucle para recorrer el tablero desde el último elemento hasta el segundo
    for (let i = game.board.length - 1; i > 0; i--) {
        // Genera un índice aleatorio entre 0 y i (inclusive)
        const j = Math.floor(Math.random() * (i + 1));
        // Intercambia el elemento en la posición i con el elemento en la posición j
        [game.board[i], game.board[j]] = [game.board[j], game.board[i]];
    }
    // Actualiza el tablero en el DOM después de mezclarlo
    updateBoard();
    }   


    // Función para iniciar el juego
    function startGame() {
        game.playerName = playerNameInput.value; // Obtiene el nombre del jugador
        if (game.playerName.length < 3) {
            showMessage('El nombre debe tener al menos 3 letras.');
            return;
        }

        // Oculta el formulario del nombre del jugador y muestra el tablero del juego
        playerForm.style.display = 'none';
        gameBoard.classList.remove('hidden');

        // Reinicia el estado del juego
        game.timeLeft = 180;
        game.score = 0;
        game.currentWord = '';
        game.currentWordPath = [];
        game.wordsFound = [];
        game.board = generateBoard(); // Genera un nuevo tablero cada vez que se inicia el juego
        updateBoard(); // Actualiza el tablero en el DOM
        updateTimer(); // Inicia el temporizador
        game.timer = setInterval(updateTimer, 1000); // Actualiza el temporizador cada segundo
    }

    // Función para actualizar el tablero en el DOM
    function updateBoard() {
        boardElement.innerHTML = ''; // Limpia el tablero
        game.board.forEach(function(letter, index) {
            var cell = document.createElement('div');
            cell.textContent = letter; // Establece la letra de la celda
            cell.dataset.index = index; // Establece el índice de la celda
            cell.classList.add('board-cell'); // Añade la clase board-cell
            cell.addEventListener('click', function() {
                selectLetter(letter, index); // Añade el event listener para seleccionar la letra
            });
            boardElement.appendChild(cell); // Añade la celda al tablero
        });
    }

    // Función para seleccionar una letra en el tablero
    function selectLetter(letter, index) {
        if (game.currentWordPath.length === 0 || isValidSelection(index)) {
            game.currentWord += letter; // Añade la letra a la palabra actual
            game.currentWordPath.push(index); // Añade el índice al camino de la palabra actual
            currentWordElement.textContent = game.currentWord; // Actualiza la palabra actual en el DOM
            document.querySelector(`[data-index='${index}']`).classList.add('selected'); // Marca la celda como seleccionada
        }
    }

    // Función para validar si la selección de una letra es correcta
    function isValidSelection(index) {
        var lastIndex = game.currentWordPath[game.currentWordPath.length - 1]; // Obtiene el último índice
        var validMoves = [
            lastIndex - 5, lastIndex - 4, lastIndex - 3, // Fila anterior
            lastIndex - 1, lastIndex + 1,               // Misma fila
            lastIndex + 3, lastIndex + 4, lastIndex + 5 // Siguiente fila
        ];
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

        // Valida la palabra usando una API de diccionario
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => response.json())
            .then(data => {
                if (data.title !== 'No Definitions Found') {
                    game.wordsFound.push(word); // Añade la palabra a las palabras encontradas
                    game.score += calculateScore(word.length); // Actualiza el puntaje
                    scoreElement.textContent = 'Puntaje: ' + game.score; // Actualiza el puntaje en el DOM
                    wordListElement.innerHTML += `<li>${word}</li>`; // Añade la palabra a la lista de palabras encontradas
                    game.currentWord = ''; // Resetea la palabra actual
                    game.currentWordPath = []; // Resetea el camino de la palabra actual
                    currentWordElement.textContent = ''; // Limpia la palabra actual en el DOM
                    clearSelectedCells(); // Limpia las celdas seleccionadas
                    showMessage('Palabra válida', 'success'); // Muestra un mensaje de éxito
                } else {
                    showMessage('Palabra no válida'); // Muestra un mensaje de error
                    deleteWordButton.click(); // Elimina la palabra si no es válida
                }
            })
            .catch(error => {
                console.error('Error al validar la palabra:', error); // Muestra un error en la consola
                showMessage('Error al validar la palabra'); // Muestra un mensaje de error
            });
    }

    // Función para eliminar la palabra actual
    function deleteWord() {
        game.currentWord = ''; // Resetea la palabra actual
        game.currentWordPath = []; // Resetea el camino de la palabra actual
        currentWordElement.textContent = ''; // Limpia la palabra actual en el DOM
        clearSelectedCells(); // Limpia las celdas seleccionadas
    }

    // Función para limpiar las celdas seleccionadas
    function clearSelectedCells() {
        var cells = document.querySelectorAll('.board-cell'); // Obtiene todas las celdas del tablero
        cells.forEach(cell => cell.classList.remove('selected')); // Elimina la clase 'selected' de cada celda
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

    // Función para finalizar el juego
    function endGame() {
        localStorage.setItem('playerName', game.playerName); // Guarda el nombre del jugador en el almacenamiento local
        localStorage.setItem('score', game.score); // Guarda el puntaje en el almacenamiento local
        window.location.href = 'gameover.html'; // Redirige a la página de fin de juego
    }

    // Añade un event listener para iniciar el juego al enviar el formulario
    playerForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el comportamiento por defecto del formulario
        startGame(); // Inicia el juego
    });

    // Añade event listeners para los botones de eliminar palabra, validar palabra y mezclar tablero
    deleteWordButton.addEventListener('click', deleteWord);
    validateWordButton.addEventListener('click', function() {
        validateWord(game.currentWord);
    });
    shuffleBoardButton.addEventListener('click', shuffleBoard);
    endGameButton.addEventListener('click', endGame);

    // Función para reiniciar el juego
    function resetGame() {
        clearInterval(game.timer); // Detiene el temporizador
        game.timeLeft = 180; // Reinicia el tiempo
        game.score = 0; // Reinicia el puntaje
        game.currentWord = ''; // Resetea la palabra actual
        game.currentWordPath = []; // Resetea el camino de la palabra actual
        game.wordsFound = []; // Resetea las palabras encontradas
        game.board = generateBoard(); // Genera un nuevo tablero
        updateBoard(); // Actualiza el tablero en el DOM
        scoreElement.textContent = 'Puntaje: 0'; // Reinicia el puntaje en el DOM
        wordListElement.innerHTML = ''; // Limpia la lista de palabras encontradas
        currentWordElement.textContent = ''; // Limpia la palabra actual en el DOM
        playerForm.style.display = 'flex'; // Muestra el formulario nuevamente
        gameBoard.classList.add('hidden'); // Oculta el tablero del juego
        messageElement.textContent = ''; // Limpia el mensaje
    }

    // Función para mostrar mensajes
    function showMessage(message, type = 'error') {
        messageElement.textContent = message; // Establece el texto del mensaje
        messageElement.className = type; // Establece la clase del mensaje
    }

});

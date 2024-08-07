// script/gameOver.js

function goToHome() {
    window.location.href = 'index.html';
}

// Función para actualizar y mostrar el ranking
function updateRanking() {
    var rankings = JSON.parse(localStorage.getItem('rankings')) || [];
    var rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '';
    rankings.forEach(function(entry, index) {
        var listItem = document.createElement('li');
        listItem.textContent = (index + 1) + '. ' + entry.playerName + ' | ' + entry.score;
        rankingList.appendChild(listItem);
    });
}

// Obtener datos del localStorage y mostrar en la página
document.addEventListener('DOMContentLoaded', function() {
    var playerName = localStorage.getItem('playerName');
    var score = localStorage.getItem('score');

    document.getElementById('player-name-display').textContent = 'Jugador: ' + playerName;
    document.getElementById('score-display').textContent = 'Puntaje: ' + score;

    // Actualiza y muestra el ranking
    updateRanking();
});

'use strict';

// Espera a que el DOM se cargue completamente antes de ejecutar la función
document.addEventListener('DOMContentLoaded', function() {
    
    // Obtiene el elemento modal por su ID
    var modal = document.getElementById('modal');
    
    // Obtiene el botón de cerrar modal por su ID
    var closeModal = document.getElementById('close-modal');

    // Añade un event listener al botón de cerrar modal para que, al hacer clic, se oculte el modal
    closeModal.addEventListener('click', function() {
        modal.classList.add('hidden'); // Añade la clase 'hidden' para ocultar el modal
    });

    // Define una función global para mostrar el modal con contenido dinámico
    window.showModal = function(content) {
        // Inserta el contenido pasado como parámetro dentro del cuerpo del modal
        document.getElementById('modal-body').innerHTML = content;
        // Remueve la clase 'hidden' para mostrar el modal
        modal.classList.remove('hidden');
    };
});

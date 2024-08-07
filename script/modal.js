'use strict';
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  menu.classList.toggle('active');
});
// Espera a que el DOM se cargue completamente antes de ejecutar la función
document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('modal');
    var closeModal = document.getElementById('close-modal');
    closeModal.addEventListener('click', function() {
        modal.classList.add('hidden'); // Añade la clase 'hidden' para ocultar el modal
    });
    // Define una función global para mostrar el modal con contenido dinámico
    window.showModal = function(content) {
        document.getElementById('modal-body').innerHTML = content;
        // Remueve la clase 'hidden' para mostrar el modal
        modal.classList.remove('hidden');
    };
});

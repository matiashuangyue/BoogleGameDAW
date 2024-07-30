'use strict';

document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('modal');
    var closeModal = document.getElementById('close-modal');

    closeModal.addEventListener('click', function() {
        modal.classList.add('hidden');
    });

    window.showModal = function(content) {
        document.getElementById('modal-body').innerHTML = content;
        modal.classList.remove('hidden');
    };
});

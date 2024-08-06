'use strict';
// al inicial el DOM se ejecuta la funcion
document.addEventListener('DOMContentLoaded', function() {
    var contactForm = document.getElementById('contact-form');
    var contactNameInput = document.getElementById('contact-name');
    var contactEmailInput = document.getElementById('contact-email');
    var contactMessageInput = document.getElementById('contact-message');
    var messageDiv = document.getElementById('message');
// se agrega un evento al formulario para que al enviarlo se ejecute la funcion
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();// se previene el comportamiento por defecto del formulario

        var name = contactNameInput.value;
        var email = contactEmailInput.value;
        var message = contactMessageInput.value;

        if (name.length < 3) {
            showMessage('El nombre debe tener al menos 3 caracteres.');
            return;
        }

        if (!validateEmail(email)) {
            showMessage('Por favor, introduce un correo electrónico válido.');
            return;
        }

        if (message.length < 5) {
            showMessage('El mensaje debe tener al menos 5 caracteres.');
            return;
        }
        showMessage('Mensaje enviado correctamente.');
        contactForm.reset();
    });

    function validateEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showMessage(message, type = 'error') {
        messageDiv.textContent = message;
        messageDiv.className = type;
        messageDiv.style.display = 'block';
    }
});

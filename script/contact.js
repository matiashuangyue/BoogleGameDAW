'use strict';

document.addEventListener('DOMContentLoaded', function() {
    var contactForm = document.getElementById('contact-form');
    var contactNameInput = document.getElementById('contact-name');
    var contactEmailInput = document.getElementById('contact-email');
    var contactMessageInput = document.getElementById('contact-message');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var name = contactNameInput.value;
        var email = contactEmailInput.value;
        var message = contactMessageInput.value;

        if (name.length < 3) {
            alert('El nombre debe tener al menos 3 caracteres.');
            return;
        }

        if (!validateEmail(email)) {
            alert('Por favor, introduce un correo electrónico válido.');
            return;
        }

        if (message.length < 5) {
            alert('El mensaje debe tener al menos 5 caracteres.');
            return;
        }

        alert('Mensaje enviado correctamente.');
        contactForm.reset();
    });

    function validateEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});

'use strict';
// al inicial el DOM se ejecuta la funcion
document.addEventListener('DOMContentLoaded', function() {
    var contactForm = document.getElementById('contact-form');
    var contactNameInput = document.getElementById('contact-name');
    var contactEmailInput = document.getElementById('contact-email');
    var contactMessageInput = document.getElementById('contact-message');
// se agrega un evento al formulario para que al enviarlo se ejecute la funcion
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();// se previene el comportamiento por defecto del formulario

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

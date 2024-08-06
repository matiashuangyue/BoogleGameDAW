'use strict';
// Al inicializar el DOM se ejecuta la función
document.addEventListener('DOMContentLoaded', function() {
    var contactForm = document.getElementById('contact-form');
    var contactNameInput = document.getElementById('contact-name');
    var contactEmailInput = document.getElementById('contact-email');
    var contactMessageInput = document.getElementById('contact-message');
    var messageDiv = document.getElementById('message');

    // Se agrega un evento al formulario para que al enviarlo se ejecute la función
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Se previene el comportamiento por defecto del formulario

        // Limpiar errores anteriores
        clearErrors();

        var name = contactNameInput.value;
        var email = contactEmailInput.value;
        var message = contactMessageInput.value;

        var valid = true;

        // Validar el nombre
        if (name.trim() === '') {
            showError('contact-name', 'El nombre es obligatorio.');
            valid = false;
        } else if (name.length < 3) {
            showError('contact-name', 'El nombre debe tener al menos 3 caracteres.');
            valid = false;
        }

        // Validar el email
        if (email.trim() === '') {
            showError('contact-email', 'El email es obligatorio.');
            valid = false;
        } else if (!validateEmail(email)) {
            showError('contact-email', 'El email no es válido.');
            valid = false;
        }

        // Validar el mensaje
        if (message.trim() === '') {
            showError('contact-message', 'El mensaje es obligatorio.');
            valid = false;
        } else if (message.length < 5) {
            showError('contact-message', 'El mensaje debe tener al menos 5 caracteres.');
            valid = false;
        }

        // Si hay errores, prevenir el envío del formulario
        if (!valid) {
            return;
        } else {
            // Construye el mailto URL
            var mailtoLink = `mailto:${email}?subject=Contacto Boggle&body=Nombre Completo: ${name}%0D%0AMensaje: ${message}`;
            // Abre el cliente de correo predeterminado
            window.location.href = mailtoLink;
            showMessage('Mensaje enviado correctamente.', 'success');
            contactForm.reset();
        }
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

    function showError(inputId, errorMessage) {
        var errorElement = document.getElementById(`error-${inputId}`);
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = `error-${inputId}`;
            errorElement.className = 'error';
            document.getElementById(inputId).parentElement.appendChild(errorElement);
        }
        errorElement.textContent = errorMessage;
    }

    function clearErrors() {
        var errorElements = document.querySelectorAll('.error');
        errorElements.forEach(function(element) {
            element.remove();
        });
    }
});

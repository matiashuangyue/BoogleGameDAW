'use strict';
document.addEventListener('DOMContentLoaded', function() {
    var themeToggleButton = document.getElementById('theme-toggle');
    var currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.add(currentTheme);
        if (currentTheme === 'dark-mode') {
            themeToggleButton.textContent = 'Modo Claro';
        }
    }

    themeToggleButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');

        let theme = 'light-mode';
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark-mode';
            themeToggleButton.textContent = 'Modo Claro';
        } else {
            themeToggleButton.textContent = 'Modo Oscuro';
        }
        localStorage.setItem('theme', theme);
    });
});

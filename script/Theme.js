'use strict';
document.addEventListener('DOMContentLoaded', function() {
    const themeToggleButton = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

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

const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  menu.classList.toggle('active');
});
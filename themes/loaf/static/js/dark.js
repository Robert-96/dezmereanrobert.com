'use strict'

document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById("toggle-dark-mode-button");

  toggleButton.addEventListener('click', function () {
    document.documentElement.classList.toggle('dark');

    if (localStorage.theme === 'dark') {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
  });
})

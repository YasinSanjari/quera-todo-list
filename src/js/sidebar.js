document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.querySelector('.toggle-menu');
    const menubar = document.getElementById('mobile-menubar');
  
    if (hamburger && sidebar && menubar) {
      hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        menubar.classList.toggle('active');
      });
    }
  });
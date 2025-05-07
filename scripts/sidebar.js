document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.querySelector(".sidebar");
  const closeBtn = document.getElementById("close-sidebar");
  const overlay = document.querySelector(".sidebar__overlay");

  function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    hamburger.style.display = "none";
  }

  function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    hamburger.style.display = "block";
  }

  hamburger.addEventListener("click", openSidebar);
  closeBtn.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);
});

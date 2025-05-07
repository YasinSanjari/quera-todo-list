document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-tags");
  const tagBox = document.getElementById("tag-box");

  toggleBtn.addEventListener("click", () => {
    tagBox.classList.toggle("hidden");
  });
});

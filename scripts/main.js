document.addEventListener("DOMContentLoaded", () => {
  const lightTheme = document.getElementById("light-theme");
  const darkTheme = document.getElementById("dark-theme");

  lightTheme.addEventListener("click", () => {
    document.documentElement.classList.remove("dark");
  });

  darkTheme.addEventListener("click", () => {
    document.documentElement.classList.add("dark");
    console.log("dark mode added")
  });
});

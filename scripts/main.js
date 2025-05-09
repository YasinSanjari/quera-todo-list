document.addEventListener("DOMContentLoaded", () => {
  const lightTheme = document.getElementById("light-theme");
  const darkTheme = document.getElementById("dark-theme");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  lightTheme.addEventListener("click", () => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  });

  darkTheme.addEventListener("click", () => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    console.log("dark mode added")
  });
});

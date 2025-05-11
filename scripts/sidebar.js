document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.querySelector(".sidebar");
  const closeBtn = document.getElementById("close-sidebar");
  const overlay = document.querySelector(".sidebar__overlay");
  const todayDate = document.getElementById("today-date");

  // sidebar overlay
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

  // date
  if (!todayDate) return;

  const today = new Date();

  const formatterWeekday = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    weekday: "long"
  });
  const formatterDay = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric"
  });
  const formatterMonth = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    month: "long"
  });
  const formatterYear = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric"
  });

  const weekday = formatterWeekday.format(today);
  const day = formatterDay.format(today);
  const month = formatterMonth.format(today);
  const year = formatterYear.format(today);

  const finalDate = `${weekday}، ${day} ${month} ${year}`;

  todayDate.textContent = finalDate;
  todayDate.style.direction = "rtl";
});

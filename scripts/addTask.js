document.addEventListener("DOMContentLoaded", () => {
  const addTaskButton = document.getElementById("add-task-btn");
  const taskDetail = document.getElementById("task-detail");
  const tasksList = document.querySelector(".taskList");
  const completedTasksList = document.querySelector("#completed-taskList");
  const taskCounter = document.querySelector(".task-todo-count");
  const completedCounter = document.querySelector(".task-done-count");

  // Load tasks from local storage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

  const priorityColorMap = {
    "text-priority-high-text-light": "bg-green-500 dark:bg-green-500",
    "text-priority-mid-text-light": "bg-orange-400 dark:bg-orange-400",
    "text-priority-low-text-light": "bg-red-500 dark:bg-red-500",
  };
  const priorityOrder = {
    "text-priority-low-text-light": 1,
    "text-priority-mid-text-light": 2,
    "text-priority-high-text-light": 3,
  };

  function updateTaskCounter() {
    taskCounter.innerText = `${tasks.length} تسک را باید انجام دهید.`;
  }

  function updateCompletedCounter() {
    completedCounter.innerText = `${completedTasks.length} تسک انجام شده است.`;
  }

  function renderTasks() {
    tasksList.innerHTML = "";
    tasks.sort(
      (a, b) =>
        (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99),
    );
    tasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.className =
        "relative rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-[#203E62] dark:bg-[#0c1b31]";
      taskItem.innerHTML = `
                <span
                    class="absolute top-3 right-0 h-4/5 w-1 rounded-1-md rounded-tl-md rounded-bl-md ${priorityColorMap[task.priority] || ""} z-10"
                ></span>
                <div class="flex items-start justify-between">
                    <div class="flex items-center">
                        <input type="checkbox" class="task-checkbox h-5 w-5 border border-gray-200 rounded-lg" data-index="${index}" />
                        <h2 class="px-4 pb-3 text-sm font-semibold">${task.title}</h2>
                    </div>
                    <button id="ellipsis" class="text-xl">&#x22EE;</button>
                </div>
                <p class="mt-1 mr-9 text-xs text-gray-500 dark:text-gray-400">${task.description}</p>
            `;
      tasksList.appendChild(taskItem);
    });
    updateTaskCounter();
    if (tasks.length === 0) {
      taskDetail.style.display = "block";
    } else {
      taskDetail.style.display = "none";
    }
  }

  function renderCompletedTasks() {
    completedTasksList.innerHTML = "";
    completedTasks.sort(
      (a, b) =>
        (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99),
    );
    completedTasks.forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.className =
        "relative rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-[#203E62] dark:bg-[#0c1b31]";
      taskItem.innerHTML = `
                <span
                    class="absolute top-3 right-0 h-4/5 w-1 rounded-1-md rounded-tl-md rounded-bl-md ${priorityColorMap[task.priority] || ""} z-10"
                ></span>
                <div class="flex items-start justify-between">
                    <div class="flex items-center">
                        <input type="checkbox" checked class="task-checkbox h-5 w-5 border border-gray-200 rounded-lg" />
                        <h2 class="px-4 pb-3 text-sm font-semibold line-through">${task.title}</h2>
                    </div>
                    <button id="ellipsis" class="text-xl">&#x22EE;</button>
                </div>
            `;
      completedTasksList.appendChild(taskItem);
    });
    updateCompletedCounter();
  }

  function showTaskForm() {
    taskDetail.style.display = "none";

    // Create form container
    const taskInputWrapper = document.createElement("div");
    taskInputWrapper.innerHTML = `
        <div class="add__task__input border-task-border-light shadow-67 font-iranYekan rounded-xl border dark:bg-background-dark" id="task-input">
            <div class="flex flex-col gap-4 p-4">
                <input type="text" placeholder="نام تسک" id="task-title" class="text-date-color-light text-[14px] focus:outline-none md:text-[16px] dark:text-white" />
                <input type="text" placeholder="توضیحات" id="task-description" class="text-task-creation-description-light text-[12px] focus:outline-none md:text-[14px]" />
                <div class="border-task-border-light text-task-creation-description-light my-6 flex w-max gap-0.5 rounded-[4px] border px-2 py-1 text-[12px]" id="tags-right">
                    <a href="#"><img src="./assets/images/tag-right.svg" alt="tags" /></a>
                    <span class="text-[12px] md:text-[14px]">تگ ها</span>
                </div>
            </div>
            <div class="border-task-border-light flex flex-row-reverse gap-1.5 border-t dark:border-[#3D3D3D] p-4">
                <button id="save-task-btn" class="bg-primary cursor-pointer rounded-[6px] px-4 py-1.5 text-[12px] text-white md:text-[14px] dark:bg-[#002247]">
                    اضافه کردن تسک
                </button>
                <button id="cancel-task-btn" class="dark:hidden">
                    <img src="./assets/images/close-circle-task.png" alt="close" class="rounded-[6px] bg-[#F5F5F5] p-1.5" />
                </button>
                <button id="cancel-task-btn-dark" class="dark:block hidden">
                    <img src="./assets/images/close-circle-dark.png" alt="close" class="rounded-[6px] dark:bg-[#002247] p-1.5" />
                </button>
            </div>
        </div>
        `;

    // Insert the form before the taskDetail element
    const mainSection = document.querySelector("main section");
    mainSection.insertBefore(taskInputWrapper, taskDetail);

    // Hide the add button
    addTaskButton.style.display = "none";

    // Save task handler
    document.getElementById("save-task-btn").addEventListener("click", () => {
      const taskTitle = document.getElementById("task-title").value.trim();
      const taskDescription = document
        .getElementById("task-description")
        .value.trim();
      const taskPriority = localStorage.getItem("selectedPriority");

      if (!taskTitle || !taskDescription || !taskPriority) {
        alert("لطفا تمام فیلدها را پر کنید و اولویت را انتخاب نمایید");
        return;
      }

      tasks.push({
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));

      // Remove the form
      taskInputWrapper.remove();
      // Show the add button again
      addTaskButton.style.display = "flex";

      renderTasks();
    });

    // Cancel handler (for both light and dark mode buttons)
    document
      .getElementById("cancel-task-btn")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        taskInputWrapper.remove();
        addTaskButton.style.display = "flex";
      });

    document
      .getElementById("cancel-task-btn-dark")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        taskInputWrapper.remove();
        addTaskButton.style.display = "flex";
      });
  }

  document.body.addEventListener("click", (e) => {
    const addBtn = e.target.closest("#add-task-btn");
    if (addBtn) {
      e.preventDefault();
      showTaskForm();
    }
  });

  document.body.addEventListener("click", (e) => {
    const isTagInitial = e.target.closest("#tags-right");
    const isTagSelected = e.target.closest(".priority-option");

    const existing = document.getElementById("priorities-container");
    if (existing) existing.remove();

    if (!isTagInitial && !isTagSelected) return;

    let tagElement = isTagInitial || isTagSelected;

    if (tagElement) {
      e.preventDefault();

      const tagsButtonWrapper = document.createElement("div");
      tagsButtonWrapper.innerHTML = `
            <div class="border-task-border-light text-task-creation-description-light my-6 flex w-max gap-0.5 rounded-[4px] border px-2 py-1 text-[12px]">
              <a href="#"><img src="./assets/images/tag-right.png" alt="tags" /></a>
              <span class="text-[12px] md:text-[14px]">تگ ها</span>
            </div>
          `;

      const originalElement = e.target.closest("#tags-right");
      const newTagsButton = tagsButtonWrapper.firstElementChild;
      originalElement.replaceWith(newTagsButton);

      const priorities = document.createElement("div");
      priorities.className = "priorities-container";
      priorities.id = "priorities-container";
      priorities.innerHTML = `
            <div data-priority="text-priority-high-text-light" class="priority-option text-priority-high-text-light cursor-pointer dark:text-priority-high-text-dark bg-priority-high-background-light dark:bg-priority-high-background-dark rounded-[4px] px-2 py-0.5 text-[12px]">
              <span>پایین</span>
            </div>
            <span class="text-[#EBEDEF] dark:text-[#293242]">|</span>
            <div data-priority="text-priority-mid-text-light" class="priority-option text-priority-mid-text-light cursor-pointer dark:text-priority-mid-text-dark bg-priority-mid-background-light dark:bg-priority-mid-background-dark rounded-[4px] px-2 py-0.5 text-[12px]">
              <span>متوسط</span>
            </div>
            <span class="text-[#EBEDEF] dark:text-[#293242]">|</span>
            <div data-priority="text-priority-low-text-light" class="priority-option text-priority-low-text-light cursor-pointer dark:text-priority-low-text-dark bg-priority-low-background-light dark:bg-priority-low-background-dark rounded-[4px] px-2 py-0.5 text-[12px]">
              <span>بالا</span>
            </div>
          `;

      priorities.querySelectorAll(".priority-option").forEach((option) => {
        option.addEventListener("click", () => {
          let selectedPriority = option.getAttribute("data-priority");
          localStorage.setItem("selectedPriority", selectedPriority);
          const newTag = document.createElement("div");
          if (selectedPriority === "text-priority-high-text-light") {
            newTag.innerHTML = `
                    <div class="priority-option text-priority-high-text-light w-max cursor-pointer dark:text-priority-high-text-dark bg-priority-high-background-light dark:bg-priority-high-background-dark rounded-[4px] px-2 py-0.5 text-[12px]">
                        <span>پایین</span>
                    </div>
                    `;
          } else if (selectedPriority === "text-priority-mid-text-light") {
            newTag.innerHTML = `
                    <div class="priority-option text-priority-mid-text-light w-max cursor-pointer dark:text-priority-mid-text-dark bg-priority-mid-background-light dark:bg-priority-mid-background-dark rounded-[4px] px-2 py-0.5 text-[12px]">
                        <span>متوسط</span>
                    </div>
                    `;
          } else if (selectedPriority === "text-priority-low-text-light") {
            newTag.innerHTML = `
                    <div class="priority-option text-priority-low-text-light w-max cursor-pointer dark:text-priority-low-text-dark bg-priority-low-background-light dark:bg-priority-low-background-dark rounded-[4px] px-2 py-0.5 text-[12px]">
                        <span>بالا</span>
                    </div>
                    `;
          }
          priorities.previousElementSibling.replaceWith(newTag);
          priorities.remove();
        });
      });

      newTagsButton.parentNode.insertBefore(
        priorities,
        newTagsButton.nextSibling,
      );
    }
  });

  document.body.addEventListener("click", (e) => {
    // Handle task completion
    if (
      e.target.classList.contains("task-checkbox") &&
      e.target.hasAttribute("data-index")
    ) {
      e.preventDefault();
      const index = e.target.dataset.index;
      const completedTask = tasks.splice(index, 1)[0];
      completedTasks.push(completedTask);

      localStorage.setItem("tasks", JSON.stringify(tasks));
      localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

      renderTasks();
      renderCompletedTasks();
    }
  });

  // Initial rendering of tasks
  renderTasks();
  renderCompletedTasks();
});

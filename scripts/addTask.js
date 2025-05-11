document.addEventListener("DOMContentLoaded", () => {
  // ========== DOM ELEMENTS ========== //
  // Main UI elements
  const addTaskButton = document.getElementById("add-task-btn");
  const taskDetail = document.getElementById("task-detail");
  const tasksList = document.querySelector(".taskList"); // Pending tasks container
  const completedTasksList = document.querySelector("#completed-taskList"); // Completed tasks container
  const taskCounter = document.querySelector(".task-todo-count"); // Pending tasks counter
  const completedCounter = document.querySelector(".task-done-count"); // Completed tasks counter

  // ========== DATA & CONFIG ========== //
  // Load tasks from localStorage (or empty arrays if none exist)
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

  // Priority styling & order mapping
  const priorityColorMap = {
    "text-priority-high-text-light": "bg-green-500 dark:bg-green-500",
    "text-priority-mid-text-light": "bg-orange-400 dark:bg-orange-400",
    "text-priority-low-text-light": "bg-red-500 dark:bg-red-500",
  };
  const priorityOrder = {
    "text-priority-low-text-light": 1, // High priority (mislabeled as "low" in UI)
    "text-priority-mid-text-light": 2, // Medium priority
    "text-priority-high-text-light": 3, // Low priority (mislabeled as "high" in UI)
  };

  // ========== COUNTER UPDATERS ========== //
  /** Updates the pending tasks counter */
  function updateTaskCounter() {
    taskCounter.innerText = `${tasks.length} تسک را باید انجام دهید.`;
  }

  /** Updates the completed tasks counter */
  function updateCompletedCounter() {
    completedCounter.innerText = `${completedTasks.length} تسک انجام شده است.`;
  }

  // ========== TASK RENDERERS ========== //
  /** Renders all pending tasks in the UI */
  function renderTasks() {
    tasksList.innerHTML = "";
    // Sort tasks by priority (high to low)
    tasks.sort(
      (a, b) =>
        (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99),
    );

    tasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.className =
        "relative rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-[#203E62] dark:bg-[#0c1b31]";
      taskItem.innerHTML = `
                <!-- Priority indicator bar -->
                <span class="absolute top-3 right-0 h-4/5 w-1 rounded-1-md rounded-tl-md rounded-bl-md ${priorityColorMap[task.priority] || ""} z-10"></span>
                <!-- Task content (checkbox, title, menu button) -->
                <div class="flex items-start justify-between">
                    <div class="flex items-center">
                        <input type="checkbox" class="task-checkbox h-5 w-5 border border-gray-200 rounded-lg" data-index="${index}" />
                        <h2 class="px-4 pb-3 text-sm font-semibold">${task.title}</h2>
                    </div>
                    <button id="ellipsis" class="text-xl">&#x22EE;</button>
                </div>
                <!-- Task description -->
                <p class="mt-1 mr-9 text-xs text-gray-500 dark:text-gray-400">${task.description}</p>
            `;
      tasksList.appendChild(taskItem);
    });
    updateTaskCounter();
    // Hide "no tasks" message if tasks exist
    taskDetail.style.display = tasks.length === 0 ? "block" : "none";
  }

  /** Renders all completed tasks in the UI */
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
                <span class="absolute top-3 right-0 h-[4.5rem] w-1 rounded-s-md ${priorityColorMap[task.priority] || ""}"></span>
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

  // ========== TASK FORM HANDLING ========== //
  /** Replaces the "Add Task" button with a form */
  function showTaskForm() {
    taskDetail.style.display = "none";
    const taskInputWrapper = document.createElement("div");
    taskInputWrapper.innerHTML = `
            <!-- Task input form (title, description, priority) -->
            <div class="add__task__input border-task-border-light shadow-67 font-iranYekan rounded-xl border dark:bg-background-dark" id="task-input">
                <!-- Form fields -->
                <div class="flex flex-col gap-4 p-4">
                    <input type="text" placeholder="نام تسک" id="task-title" class="text-date-color-light text-[14px] focus:outline-none md:text-[16px] dark:text-white" />
                    <input type="text" placeholder="توضیحات" id="task-description" class="text-task-creation-description-light text-[12px] focus:outline-none md:text-[14px]" />
                    <!-- Priority selector (triggered by clicking "Tags") -->
                    <div class="border-task-border-light text-task-creation-description-light my-6 flex w-max gap-0.5 rounded-[4px] border px-2 py-1 text-[12px]" id="tags-right">
                        <a href="#"><img src="./assets/images/tag-right.svg" alt="tags" /></a>
                        <span class="text-[12px] md:text-[14px]">تگ ها</span>
                    </div>
                </div>
                <!-- Form buttons (save/cancel) -->
                <div class="border-task-border-light flex flex-row-reverse gap-1.5 border-t dark:border-[#3D3D3D] p-4">
                    <button id="save-task-btn" class="bg-primary cursor-pointer rounded-[6px] px-4 py-1.5 text-[12px] text-white md:text-[14px] dark:bg-[#002247]">اضافه کردن تسک</button>
                    <a href="" class="dark:hidden"><img src="./assets/images/close-circle-task.png" alt="close" class="rounded-[6px] bg-[#F5F5F5] p-1.5" /></a>
                    <a href="" class="dark:block hidden"><img src="./assets/images/close-circle-dark.png" alt="close" class="rounded-[6px] dark:bg-[#002247] p-1.5" /></a>
                </div>
            </div>
        `;

    const newForm = taskInputWrapper.firstElementChild;
    addTaskButton.replaceWith(newForm);

    // Save task on button click
    newForm.querySelector("#save-task-btn").addEventListener("click", () => {
      const taskTitle = document.getElementById("task-title").value.trim();
      const taskDescription = document
        .getElementById("task-description")
        .value.trim();
      const taskPriority = localStorage.getItem("selectedPriority");

      if (!taskTitle || !taskDescription || !taskPriority) return;

      tasks.push({
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      document.getElementById("task-input").remove();

      // Restore the "Add Task" button
      const newAddBtn = document.createElement("div");
      newAddBtn.innerHTML = `
                <div class="add-task-btn cursor-pointer dark:bg-background-navbar-dark text-[14px] md:text-[16px] dark:border-[#203E62]" id="add-task-btn">
                    <img src="./assets/images/add.png" class="h-6 w-6" />
                    <span>افزودن وظیفه جدید</span>
                </div>
            `;
      document
        .querySelector("main section")
        .insertBefore(newAddBtn.firstElementChild, taskDetail);
      renderTasks();
    });
  }

  // ========== EVENT LISTENERS ========== //
  /** Click: "Add Task" button → Opens task form */
  document.body.addEventListener("click", (e) => {
    if (e.target.closest("#add-task-btn")) {
      e.preventDefault();
      showTaskForm();
    }
  });

  // Handle clicks on priority selection elements
  document.body.addEventListener("click", (e) => {
    // Check if click was on the tags button or a priority option
    const isTagInitial = e.target.closest("#tags-right");
    const isTagSelected = e.target.closest(".priority-option");

    // Remove any existing priority menu if open
    const existing = document.getElementById("priorities-container");
    if (existing) existing.remove();

    // Exit if click wasn't on a relevant element
    if (!isTagInitial && !isTagSelected) return;

    // Determine which element was clicked (tags button or priority option)
    let tagElement = isTagInitial || isTagSelected;

    if (tagElement) {
      e.preventDefault();

      // ===== STEP 1: REPLACE TAGS BUTTON =====
      // Create new tags button to reset event listeners
      const tagsButtonWrapper = document.createElement("div");
      tagsButtonWrapper.innerHTML = `
            <div class="border-task-border-light text-task-creation-description-light my-6 flex w-max gap-0.5 rounded-[4px] border px-2 py-1 text-[12px]">
                <a href="#"><img src="./assets/images/tag-right.png" alt="tags" /></a>
                <span class="text-[12px] md:text-[14px]">تگ ها</span>
            </div>
        `;

      // Replace old tags button with new one
      const originalElement = e.target.closest("#tags-right");
      const newTagsButton = tagsButtonWrapper.firstElementChild;
      originalElement.replaceWith(newTagsButton);

      // ===== STEP 2: CREATE PRIORITY OPTIONS MENU =====
      const priorities = document.createElement("div");
      priorities.className = "priorities-container";
      priorities.id = "priorities-container";
      priorities.innerHTML = `
            <!-- High Priority Option -->
            <div data-priority="text-priority-high-text-light" class="priority-option text-priority-high-text-light cursor-pointer dark:text-priority-high-text-dark bg-priority-high-background-light dark:bg-priority-high-background-dark rounded-[4px] px-2 py-0.5 text-[12px]">
                <span>پایین</span>
            </div>
            <span class="text-[#EBEDEF] dark:text-[#293242]">|</span>
            
            <!-- Medium Priority Option -->
            <div data-priority="text-priority-mid-text-light" class="priority-option text-priority-mid-text-light cursor-pointer dark:text-priority-mid-text-dark bg-priority-mid-background-light dark:bg-priority-mid-background-dark rounded-[4px] px-2 py-0.5 text-[12px]">
                <span>متوسط</span>
            </div>
            <span class="text-[#EBEDEF] dark:text-[#293242]">|</span>
            
            <!-- Low Priority Option -->
            <div data-priority="text-priority-low-text-light" class="priority-option text-priority-low-text-light cursor-pointer dark:text-priority-low-text-dark bg-priority-low-background-light dark:bg-priority-low-background-dark rounded-[4px] px-2 py-0.5 text-[12px]">
                <span>بالا</span>
            </div>
        `;

      // ===== STEP 3: HANDLE PRIORITY SELECTION =====
      priorities.querySelectorAll(".priority-option").forEach((option) => {
        option.addEventListener("click", () => {
          // Get selected priority value
          let selectedPriority = option.getAttribute("data-priority");

          // Store in localStorage
          localStorage.setItem("selectedPriority", selectedPriority);

          // Create visual tag for selected priority
          const newTag = document.createElement("div");

          // High priority styling
          if (selectedPriority === "text-priority-high-text-light") {
            newTag.innerHTML = `
                    <div class="priority-option text-priority-high-text-light w-max cursor-pointer dark:text-priority-high-text-dark bg-priority-high-background-light dark:bg-priority-high-background-dark rounded-[4px] px-2 py-0.5 text-[12px]">
                        <span>پایین</span>
                    </div>
                    `;
          }
          // Medium priority styling
          else if (selectedPriority === "text-priority-mid-text-light") {
            newTag.innerHTML = `
                    <div class="priority-option text-priority-mid-text-light w-max cursor-pointer dark:text-priority-mid-text-dark bg-priority-mid-background-light dark:bg-priority-mid-background-dark rounded-[4px] px-2 py-0.5 text-[12px]">
                        <span>متوسط</span>
                    </div>
                    `;
          }
          // Low priority styling
          else if (selectedPriority === "text-priority-low-text-light") {
            newTag.innerHTML = `
                    <div class="priority-option text-priority-low-text-light w-max cursor-pointer dark:text-priority-low-text-dark bg-priority-low-background-light dark:bg-priority-low-background-dark rounded-[4px] px-2 py-0.5 text-[12px]">
                        <span>بالا</span>
                    </div>
                    `;
          }

          // Replace priority menu with selected priority tag
          priorities.previousElementSibling.replaceWith(newTag);
          priorities.remove();
        });
      });

      // ===== STEP 4: INSERT MENU INTO DOM =====
      // Place priority options right after the tags button
      newTagsButton.parentNode.insertBefore(
        priorities,
        newTagsButton.nextSibling,
      );
    }
  });

  /** Click: Checkbox → Moves task to "completed" */
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("task-checkbox")) {
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

  // ========== INITIAL RENDER ========== //
  renderTasks();
  renderCompletedTasks();
});

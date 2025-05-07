document.addEventListener("DOMContentLoaded", () => {
    const addTaskButton = document.getElementById("add-task-btn");
  
    addTaskButton.addEventListener("click", () => {
      const taskInputWrapper = document.createElement("div");
      taskInputWrapper.innerHTML = `
        <div
          class="add__task__input border-task-border-light shadow-67 font-iranYekan rounded-xl border dark:bg-background-dark"
          id="task-input"
        >
          <div class="flex flex-col gap-4 p-4">
            <input
              type="text"
              placeholder="نام تسک"
              id="task-title"
              class="text-date-color-light text-[14px] focus:outline-none md:text-[16px] dark:text-white"
            />
            <input
              type="text"
              placeholder="توضیحات"
              id="task-description"
              class="text-task-creation-description-light text-[12px] focus:outline-none md:text-[14px]"
            />
            <div
              class="border-task-border-light text-task-creation-description-light my-6 flex w-max gap-0.5 rounded-[4px] border px-2 py-1 text-[12px]"
              id="tags-right"
            >
              <a href="#"><img src="./assets/images/tag-right.svg" alt="tags" /></a>
              <span class="text-[12px] md:text-[14px]">تگ ها</span>
            </div>
          </div>
          <div
            class="border-task-border-light flex flex-row-reverse gap-1.5 border-t dark:border-[#3D3D3D] p-4"
          >
            <button
              class="bg-primary rounded-[6px] px-4 py-1.5 text-[12px] text-white md:text-[14px] dark:bg-[#002247]"
            >
              اضافه کردن تسک
            </button>
            <a href="" class="dark:hidden">
              <img
                src="./assets/images/close-circle-task.png"
                alt="close"
                class="rounded-[6px] bg-[#F5F5F5] p-1.5"
              />
            </a>
            <a href="" class="">
              <img
                src="./assets/images/close-circle-dark.png"
                alt="close"
                class="rounded-[6px] dark:bg-[#002247] p-1.5"
              />
            </a>
          </div>
        </div>
      `;
      
      addTaskButton.replaceWith(taskInputWrapper.firstElementChild);
    });
  
    document.body.addEventListener("click", (e) => {
        if (e.target && e.target.closest("#tags-right")) {
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
            <div class="text-priority-high-text-light dark:text-priority-high-text-dark bg-priority-high-background-light dark:bg-priority-high-background-dark rounded-[4px] px-2 py-0.5 text-[12px]">
              <span>پایین</span>
            </div>
            <span class="text-[#EBEDEF] dark:text-[#293242]">|</span>
            <div class="text-priority-mid-text-light dark:text-priority-mid-text-dark bg-priority-mid-background-light dark:bg-priority-mid-background-dark rounded-[4px] px-2 py-0.5 text-[12px]">
              <span>متوسط</span>
            </div>
            <span class="text-[#EBEDEF] dark:text-[#293242]">|</span>
            <div class="text-priority-low-text-light dark:text-priority-low-text-dark bg-priority-low-background-light dark:bg-priority-low-background-dark rounded-[4px] px-2 py-0.5 text-[12px]">
              <span>بالا</span>
            </div>
          `;
          
          newTagsButton.parentNode.insertBefore(priorities, newTagsButton.nextSibling);
        }
      });
  });
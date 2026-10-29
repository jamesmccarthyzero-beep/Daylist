/* ===== 1. GET EXISTING HTML ELEMENTS ===== */

const taskInput = document.getElementById("task-input"); // Text input
const taskForm = document.getElementById("task-form"); // Add task form
const taskList = document.getElementById("task-list"); // UL task list
const taskCount = document.getElementById("task-count");
const progressLabel = document.getElementById("progress-label"); // Completed progress display
const progressBar = document.getElementById("progress-bar"); // Purple progress bar
const filterButtons = document.querySelectorAll(".filter-btn");

/* ===== 1. GET EXISTING HTML ELEMENTS ===== */
const clearCompletedButton = document.getElementById("clear-completed");

clearCompletedButton.addEventListener("click", function () {
  const completedCheckboxes = taskList.querySelectorAll(
    ".task-checkbox:checked",
  );

  completedCheckboxes.forEach(function (checkbox) {
    const taskItem = checkbox.closest(".task-item");
    taskItem.remove();
  });
  updateTaskCount();
  updateProgress();
  saveTasks();
});

/* ===== TASK FILTERS ===== */
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (filterButton) {
      filterButton.classList.remove("active");
    });

    button.classList.add("active");

    const selectedFilter = button.dataset.filter;
    applyFilter(selectedFilter);
  });
});

function applyFilter(selectedFilter) {
  const taskItems = taskList.querySelectorAll(".task-item");

  taskItems.forEach(function (item) {
    const checkbox = item.querySelector(".task-checkbox");
    const completed = checkbox.checked;

    if (selectedFilter === "active" && completed) {
      item.style.display = "none";
    } else if (selectedFilter === "completed" && !completed) {
      item.style.display = "none";
    } else {
      item.style.display = "";
    }
  });
}

/* ===== 2. UPDATE TASK COUNTER ===== */
function updateTaskCount() {
  taskCount.textContent = taskList.children.length + " tasks";
}

// UPDATE COMPLETED TASK PROGRESS
function updateProgress() {
  const total = taskList.children.length;
  const completed = document.querySelectorAll(".task-checkbox:checked").length;
  const percentage = total === 0 ? 0 : (completed / total) * 100;

  progressLabel.textContent = completed + " / " + total + " done";
  progressBar.style.width = percentage + "%";
}

/* ===== GET TASK DATA ===== */
function getTasks() {
  const tasks = [];

  taskList.querySelectorAll(".task-item").forEach(function (item) {
    const text = item.querySelector(".task-text").textContent;
    const completed = item.querySelector(".task-checkbox").checked;

    tasks.push({
      text: text,
      completed: completed,
    });
  });

  return tasks;
}

/* ===== 3. Saves Tasks ===== */
function saveTasks() {
  const tasks = getTasks();
  localStorage.setItem("daylistTasks", JSON.stringify(tasks));
}

/* ===== 3. Load Tasks ===== */
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("daylistTasks"));
  return savedTasks;
}

/* ===== CREATE TASK ELEMENT ===== */
function createTaskElement(task) {
  const newItem = document.createElement("li");
  newItem.className = "task-item";
  const taskLabel = document.createElement("label");
  taskLabel.className = "task-label";
  const taskCheckbox = document.createElement("input");
  taskCheckbox.type = "checkbox";
  taskCheckbox.className = "task-checkbox";
  taskCheckbox.checked = task.completed;
  taskLabel.appendChild(taskCheckbox);
  newItem.appendChild(taskLabel);
  const taskText = document.createElement("span");
  taskText.className = "task-text";
  taskText.textContent = task.text;
  taskLabel.appendChild(taskText);
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "×";
  newItem.appendChild(deleteButton);
  return newItem;
}

/* ===== RESTORE SAVED TASKS ===== */
function restoreTasks() {
  const savedTasks = loadTasks();

  if (savedTasks === null) return;

  taskList.replaceChildren();

  savedTasks.forEach(function (task) {
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
  });

  updateTaskCount();
  updateProgress();
}

/* ===== CHECKBOX CHANGES ===== */

taskList.addEventListener("change", function () {
  updateProgress();
  saveTasks();
  const selectedFilter =
    document.querySelector(".filter-btn.active").dataset.filter;
  applyFilter(selectedFilter);
});

/* ===== DELETE BUTTON CLICKS ===== */
taskList.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-button")) {
    const taskItem = e.target.closest(".task-item");
    taskItem.remove();
    updateTaskCount();
    updateProgress();
    saveTasks();
  }
});

/* ===== HANDLE FORM SUBMMISON */
taskForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Stop page refresh

  const normalizedText = taskInput.value.trim().toLowerCase();

  if (normalizedText === "") {
    return;
  }

  const existingTasks = getTasks();
  const duplicateExists = existingTasks.some(function (task) {
    return task.text.trim().toLowerCase() === normalizedText;
  });

  if (duplicateExists) {
    alert("This task already exists!");
    return;
  }

  const newTask = { text: taskInput.value.trim(), completed: false };
  const newItem = createTaskElement(newTask);

  taskList.appendChild(newItem);
  updateTaskCount();
  updateProgress();
  saveTasks();
  const selectedFilter =
    document.querySelector(".filter-btn.active").dataset.filter;
  applyFilter(selectedFilter);

  // RESET INPUT
  taskInput.value = "";
});
restoreTasks();

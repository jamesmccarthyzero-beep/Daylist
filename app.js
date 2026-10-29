/* ===== 1. GET EXISTING HTML ELEMENTS ===== */

const taskInput = document.getElementById("task-input"); // Text input
const taskForm = document.getElementById("task-form"); // Add task form
const taskList = document.getElementById("task-list"); // UL task list
const taskCount = document.getElementById("task-count");
const progressLabel = document.getElementById("progress-label"); // Completed progress display
const progressBar = document.getElementById("progress-bar"); // Purple progress bar
console.log(taskCount);

/* ===== 2. UPDATE TASK COUNTER ===== */
function updateTaskCount() {
  taskCount.textContent = taskList.children.length + " tasks";
}

// UPDATE COMPLETED TASK PROGRESS
function updateProgress() {
  const total = taskList.children.length;
  const completed = document.querySelectorAll(".task-checkbox:checked").length;
  const percentage = (completed / total) * 100;

  console.log(percentage);

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
  console.log(taskCheckbox.checked);
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

/* ===== 2. HANDLE FORM SUBMISSION ===== */

taskForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Stop page refresh

  // CREATE ELEMENTS
  const newItem = document.createElement("li"); // Task row
  const taskLabel = document.createElement("label"); // Checkbox/text wrapper
  const taskCheckbox = document.createElement("input");
  const taskText = document.createElement("span"); // Task text
  const deleteButton = document.createElement("button"); // Delete button

  // SET PROPERTIES & CLASSES
  newItem.className = "task-item";
  taskLabel.className = "task-label";
  taskCheckbox.className = "task-checkbox";
  taskCheckbox.type = "checkbox";
  taskText.className = "task-text";
  taskText.textContent = taskInput.value;
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "×";

  // BUILD THE HTML STRUCTURE
  taskLabel.appendChild(taskCheckbox);
  taskLabel.appendChild(taskText);

  newItem.appendChild(taskLabel);
  newItem.appendChild(deleteButton);

  taskList.appendChild(newItem);
  updateTaskCount();
  updateProgress();
  saveTasks();

  // RESET INPUT
  taskInput.value = "";

  console.log(newItem);
});
restoreTasks();

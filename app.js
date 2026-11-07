import { loadTasks, saveTasksToStorage } from "./storage.js";

/* ===== 1. GET EXISTING HTML ELEMENTS ===== */

const taskInput = document.getElementById("task-input"); // Text input
const taskForm = document.getElementById("task-form"); // Add task form
const taskList = document.getElementById("task-list"); // UL task list
const taskCount = document.getElementById("task-count");
const progressLabel = document.getElementById("progress-label"); // Completed progress display
const progressBar = document.getElementById("progress-bar"); // Purple progress bar
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedButton = document.getElementById("clear-completed");
const taskDueDate = document.getElementById("task-due-date");
const taskPriority = document.getElementById("task-priority");
const remainingCount = document.getElementById("remaining-count");
const clearDueDateButton = document.getElementById("clear-due-date");
const submitButton = document.querySelector(".add-button");
let editingTask = null;

clearDueDateButton.addEventListener("click", function () {
  taskDueDate.value = "";
});

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
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  taskItems.forEach(function (item) {
    const checkbox = item.querySelector(".task-checkbox");
    const completed = checkbox.checked;

    const dueDate = item.dataset.dueDate;
    const date = new Date(dueDate + "T00:00:00");
    // console.log("Parsed date:", date, "Timestamp:", date.getTime());
    const hasDueDate = dueDate !== "";
    // console.log("Due date:", dueDate, "Has date:", hasDueDate);
    // console.log(Number.isNaN(date.getTime()));
    const hasValidDate = hasDueDate && Number.isFinite(date.getTime());
    // console.log(hasValidDate);
    const isToday = today.getTime() === date.getTime();
    console.log("Is due today:", isToday);

    if (selectedFilter === "active" && completed) {
      item.style.display = "none";
    } else if (selectedFilter === "completed" && !completed) {
      item.style.display = "none";
    } else if (selectedFilter === "today" && (!hasValidDate || !isToday)) {
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
  const remaining = total - completed;

  remainingCount.textContent = remaining + " tasks left — keep going!";

  progressLabel.textContent = completed + " / " + total + " done";
  progressBar.style.width = percentage + "%";
}

/* ===== GET TASK DATA ===== */
function getTasks() {
  const tasks = [];

  taskList.querySelectorAll(".task-item").forEach(function (item) {
    const text = item.querySelector(".task-text").textContent;
    const completed = item.querySelector(".task-checkbox").checked;
    const dueDate = item.dataset.dueDate;
    const priority = item.dataset.priority;

    tasks.push({
      text: text,
      completed: completed,
      dueDate: dueDate,
      priority: priority,
    });
  });

  return tasks;
}

/* ===== 3. Saves Tasks ===== */
function saveTasks() {
  const tasks = getTasks();
  saveTasksToStorage(tasks);
}

const priorityOrder = {
  high: 1,
  normal: 2,
};

function sortTasksByPriority() {
  const taskItems = Array.from(taskList.children);
  taskItems.sort(function (a, b) {
    const priorityA = a.dataset.priority;
    const priorityB = b.dataset.priority;
    const dateA = a.dataset.dueDate;
    const dateB = b.dataset.dueDate;

    const rankA = priorityOrder[priorityA];
    const rankB = priorityOrder[priorityB];

    if (rankA !== rankB) {
      return rankA - rankB;
    }

    if (dateA === "" && dateB !== "") {
      return 1;
    }

    if (dateA !== "" && dateB === "") {
      return -1;
    }

    if (dateA < dateB) {
      return -1;
    } else if (dateA === dateB) {
      return 0;
    } else {
      return 1;
    }
  });

  taskItems.forEach(function (item) {
    taskList.appendChild(item);
  });
}

function updateDueDateLabel(taskItem) {
  const dueDateLabel = taskItem.querySelector(".task-due-date");
  const dueDate = taskItem.dataset.dueDate;
  const taskCheckbox = taskItem.querySelector(".task-checkbox");

  dueDateLabel.classList.remove("overdue", "due-today");

  if (dueDate) {
    const date = new Date(dueDate + "T00:00:00");

    dueDateLabel.textContent = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today && !taskCheckbox.checked) {
      dueDateLabel.textContent += " • Overdue";
      dueDateLabel.classList.add("overdue");
    } else if (date.getTime() === today.getTime() && !taskCheckbox.checked) {
      dueDateLabel.textContent += " • Due Today";
      dueDateLabel.classList.add("due-today");
    }
  } else {
    dueDateLabel.textContent = "";
  }
}

/* ===== CREATE TASK ELEMENT ===== */
function createTaskElement(task) {
  const newItem = document.createElement("li");
  newItem.className = "task-item";
  newItem.dataset.dueDate = task.dueDate || "";
  newItem.dataset.priority = ["normal", "high"].includes(task.priority)
    ? task.priority
    : "normal";
  const taskLabel = document.createElement("label");
  taskLabel.className = "task-label";
  const taskCheckbox = document.createElement("input");
  taskCheckbox.type = "checkbox";
  taskCheckbox.className = "task-checkbox";
  taskCheckbox.checked = task.completed;
  taskLabel.appendChild(taskCheckbox);
  newItem.appendChild(taskLabel);
  const taskText = document.createElement("span");
  const dueDateLabel = document.createElement("span");
  const priorityLabel = document.createElement("span");
  priorityLabel.className = "priority-badge";
  priorityLabel.textContent = newItem.dataset.priority;
  dueDateLabel.className = "task-due-date";

  taskText.className = "task-text";
  taskText.textContent = task.text;
  taskLabel.appendChild(taskText);
  taskLabel.appendChild(dueDateLabel);
  taskLabel.appendChild(priorityLabel);
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  editButton.type = "button";
  deleteButton.className = "delete-button";
  editButton.className = "edit-button";
  deleteButton.textContent = "×";
  editButton.textContent = "Edit";
  newItem.appendChild(editButton);
  newItem.appendChild(deleteButton);
  updateDueDateLabel(newItem);
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

taskList.addEventListener("change", function (event) {
  updateProgress();
  saveTasks();
  const selectedFilter =
    document.querySelector(".filter-btn.active").dataset.filter;
  applyFilter(selectedFilter);
  const taskItem = event.target.closest(".task-item");
  updateDueDateLabel(taskItem);
});

/* ===== DELETE BUTTON CLICKS ===== */
taskList.addEventListener("click", function (e) {
  const taskItem = e.target.closest(".task-item");
  if (e.target.classList.contains("delete-button")) {
    taskItem.remove();
    updateTaskCount();
    updateProgress();
    saveTasks();
  } else if (e.target.classList.contains("edit-button")) {
    const taskText = taskItem.querySelector(".task-text");
    taskInput.value = taskText.textContent;
    taskDueDate.value = taskItem.dataset.dueDate;
    editingTask = taskItem;
    submitButton.textContent = "Save Changes";
    taskPriority.value = taskItem.dataset.priority;
  }
});

function formatTaskText(text) {
  const words = text.trim().split(" ");
  const capitalizedWords = words.map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  const formattedText = capitalizedWords.join(" ");
  return formattedText;
}

/* ===== HANDLE FORM SUBMMISON */
taskForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Stop page refresh

  const normalizedText = taskInput.value.trim().toLowerCase();

  if (normalizedText === "") {
    return;
  }

  const existingTasks = getTasks();
  const duplicateExists = existingTasks.some(function (task, index) {
    if (taskList.children[index] === editingTask) {
      return false;
    }
    return task.text.trim().toLowerCase() === normalizedText;
  });

  if (duplicateExists) {
    alert("This task already exists!");
    return;
  }

  if (editingTask !== null) {
    const taskText = editingTask.querySelector(".task-text");
    taskText.textContent = formatTaskText(taskInput.value);
    editingTask.dataset.dueDate = taskDueDate.value;
    editingTask.dataset.priority = taskPriority.value;
    updateDueDateLabel(editingTask);
    const priorityLabel = editingTask.querySelector(".priority-badge");
    priorityLabel.textContent = editingTask.dataset.priority;
    sortTasksByPriority();
    saveTasks();
    editingTask = null;
    taskInput.value = "";
    taskDueDate.value = "";
    taskPriority.value = "normal";
    submitButton.textContent = "+ Add task";
    return;
  }

  const newTask = {
    text: formatTaskText(taskInput.value),
    completed: false,
    dueDate: taskDueDate.value,
    priority: taskPriority.value,
  };

  const newItem = createTaskElement(newTask);

  taskList.appendChild(newItem);
  sortTasksByPriority();
  updateTaskCount();
  updateProgress();
  saveTasks();
  const selectedFilter =
    document.querySelector(".filter-btn.active").dataset.filter;
  applyFilter(selectedFilter);

  // RESET INPUT
  taskInput.value = "";
  taskDueDate.value = "";
  taskPriority.value = "normal";
});
restoreTasks();

sortTasksByPriority();

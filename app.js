/* ===== 1. GET EXISTING HTML ELEMENTS ===== */

const taskInput = document.getElementById("task-input"); // Text input
const taskForm = document.getElementById("task-form"); // Add task form
const taskList = document.getElementById("task-list"); // UL task list
const taskCount = document.getElementById("task-count");
console.log(taskCount);

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
  taskCount.textContent = taskList.children.length + " tasks";

  // DELETE TASK WHEN CLICKED
  deleteButton.addEventListener("click", function () {
    newItem.remove();

    taskCount.textContent = taskList.childElementCount + " tasks";
  });

  // RESET INPUT
  taskInput.value = "";

  console.log(newItem);
});

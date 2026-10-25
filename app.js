const taskInput = document.getElementById("task-input");
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const newItem = document.createElement("li");
  const taskText = document.createElement("span");
  const taskLabel = document.createElement("label");

  taskLabel.className = "task-label";
  taskText.className = "task-text";
  newItem.className = "task-item";
  taskText.textContent = taskInput.value;

  taskLabel.appendChild(taskText);
  newItem.appendChild(taskLabel);
  taskList.appendChild(newItem);
  taskInput.value = "";
  console.log(newItem);
});

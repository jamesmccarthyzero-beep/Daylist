/* ===== 3. Load Tasks ===== */
export function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("daylistTasks"));
  return savedTasks;
}

export function saveTasksToStorage(tasks) {
  localStorage.setItem("daylistTasks", JSON.stringify(tasks));
}

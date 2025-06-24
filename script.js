const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const themeToggle = document.getElementById('theme-toggle');

// Load theme from localStorage
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  if (document.body.classList.contains('dark')) {
    localStorage.setItem('darkMode', 'enabled');
    themeToggle.textContent = '☀️';
  } else {
    localStorage.setItem('darkMode', 'disabled');
    themeToggle.textContent = '🌙';
  }
});

addBtn.addEventListener('click', addTask);

function addTask() {
  const text = input.value.trim();
  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    completed: false
  };

  saveTask(task);
  renderTask(task);
  input.value = '';
}

function renderTask(task) {
  const li = document.createElement('li');
  li.className = 'task';
  if (task.completed) li.classList.add('completed');
  li.dataset.id = task.id;

  const span = document.createElement('span');
  span.textContent = task.text;
  span.addEventListener('click', () => toggleComplete(task.id));

  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.addEventListener('click', () => deleteTask(task.id));

  li.appendChild(span);
  li.appendChild(delBtn);
  taskList.appendChild(li);
}

function toggleComplete(id) {
  const tasks = getTasks();
  const updated = tasks.map(t => {
    if (t.id === id) t.completed = !t.completed;
    return t;
  });
  localStorage.setItem('tasks', JSON.stringify(updated));
  refreshUI();
}

function deleteTask(id) {
  const tasks = getTasks().filter(t => t.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  refreshUI();
}

function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function refreshUI() {
  taskList.innerHTML = '';
  getTasks().forEach(renderTask);
}

// Load tasks on page load
window.addEventListener('DOMContentLoaded', refreshUI);
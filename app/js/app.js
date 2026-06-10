const QUOTES = [
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Success is the sum of small efforts, repeated day in and day out.', author: 'Robert Collier' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'The future belongs to those who prepare for it today.', author: 'Malcolm X' },
  { text: 'You don\'t have to be great to start, but you have to start to be great.', author: 'Zig Ziglar' },
  { text: 'Study while others are sleeping; work while others are loafing.', author: 'William Arthur Ward' },
  { text: 'Education is the passport to the future, for tomorrow belongs to those who prepare for it today.', author: 'Malcolm X' },
  { text: 'The expert in anything was once a beginner.', author: 'Helen Hayes' },
  { text: 'Push yourself, because no one else is going to do it for you.', author: 'Unknown' },
  { text: 'Dream big and dare to fail.', author: 'Norman Vaughan' }
];

let tasks = [];
let currentFilter = 'all';

const els = {
  root: document.documentElement,
  themeToggle: document.getElementById('theme-toggle'),
  logo: document.getElementById('logo'),
  quoteText: document.getElementById('quote-text'),
  quoteAuthor: document.getElementById('quote-author'),
  newQuoteBtn: document.getElementById('new-quote-btn'),
  progressBar: document.getElementById('progress-bar'),
  progressFill: document.getElementById('progress-fill'),
  progressPercent: document.getElementById('progress-percent'),
  statTotal: document.getElementById('stat-total'),
  statDone: document.getElementById('stat-done'),
  statPending: document.getElementById('stat-pending'),
  taskForm: document.getElementById('task-form'),
  taskTitle: document.getElementById('task-title'),
  taskSubject: document.getElementById('task-subject'),
  taskPriority: document.getElementById('task-priority'),
  taskList: document.getElementById('task-list'),
  emptyState: document.getElementById('empty-state'),
  clearCompletedBtn: document.getElementById('clear-completed-btn'),
  filterBtns: document.querySelectorAll('.filter-btn')
};

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  els.root.dataset.theme = theme;
  els.themeToggle.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  );
}

function initTheme() {
  const saved = localStorage.getItem(CONFIG.THEME_KEY);
  const theme = saved === 'light' || saved === 'dark' ? saved : getSystemTheme();
  applyTheme(theme);
}

function toggleTheme() {
  const current = els.root.dataset.theme || getSystemTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(CONFIG.THEME_KEY, next);
}

function initAssets() {
  if (CONFIG.S3_ASSET_BASE && CONFIG.ASSETS.logo) {
    els.logo.src = `${CONFIG.S3_ASSET_BASE}/${CONFIG.ASSETS.logo}`;
    els.logo.onerror = () => {
      els.logo.style.display = 'none';
    };
  }
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    tasks = saved ? JSON.parse(saved) : [];
  } catch {
    tasks = [];
  }
}

function saveTasks() {
  localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(tasks));
}

function generateId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function showQuote(index) {
  const quote = QUOTES[index ?? Math.floor(Math.random() * QUOTES.length)];
  els.quoteText.textContent = `"${quote.text}"`;
  els.quoteAuthor.textContent = `— ${quote.author}`;
}

function getFilteredTasks() {
  if (currentFilter === 'active') {
    return tasks.filter((t) => !t.completed);
  }
  if (currentFilter === 'completed') {
    return tasks.filter((t) => t.completed);
  }
  return tasks;
}

function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const pending = total - done;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  els.statTotal.textContent = total;
  els.statDone.textContent = done;
  els.statPending.textContent = pending;
  els.progressPercent.textContent = `${percent}% complete`;
  els.progressFill.style.width = `${percent}%`;
  els.progressBar.setAttribute('aria-valuenow', percent);

  const hasCompleted = done > 0;
  els.clearCompletedBtn.hidden = !hasCompleted;
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item${task.completed ? ' task-item--done' : ''}`;
  li.dataset.id = task.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-item__checkbox';
  checkbox.checked = task.completed;
  checkbox.setAttribute('aria-label', `Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`);
  checkbox.addEventListener('change', () => toggleTask(task.id));

  const content = document.createElement('div');
  content.className = 'task-item__content';

  const title = document.createElement('span');
  title.className = 'task-item__title';
  title.textContent = task.title;

  const meta = document.createElement('div');
  meta.className = 'task-item__meta';

  const subject = document.createElement('span');
  subject.className = 'task-item__tag';
  subject.textContent = task.subject;

  const priority = document.createElement('span');
  priority.className = `task-item__priority task-item__priority--${task.priority}`;
  priority.textContent = task.priority;

  meta.append(subject, priority);
  content.append(title, meta);

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'task-item__delete';
  deleteBtn.setAttribute('aria-label', `Delete "${task.title}"`);
  deleteBtn.textContent = '×';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  li.append(checkbox, content, deleteBtn);
  return li;
}

function renderTasks() {
  const filtered = getFilteredTasks();
  els.taskList.innerHTML = '';

  filtered.forEach((task) => {
    els.taskList.appendChild(createTaskElement(task));
  });

  const showEmpty = filtered.length === 0;
  els.emptyState.hidden = !showEmpty;

  if (showEmpty && tasks.length > 0) {
    els.emptyState.textContent =
      currentFilter === 'completed'
        ? 'No completed tasks yet.'
        : 'No active tasks. Great job — or add a new one!';
  } else if (tasks.length === 0) {
    els.emptyState.textContent = 'No tasks yet. Add your first study task above!';
  }

  updateProgress();
}

function addTask(title, subject, priority) {
  const task = {
    id: generateId(),
    title: title.trim(),
    subject,
    priority,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.unshift(task);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  renderTasks();
}

function setFilter(filter) {
  currentFilter = filter;
  els.filterBtns.forEach((btn) => {
    btn.classList.toggle('filter-btn--active', btn.dataset.filter === filter);
  });
  renderTasks();
}

els.taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = els.taskTitle.value.trim();
  if (!title) {
    els.taskTitle.focus();
    return;
  }
  addTask(title, els.taskSubject.value, els.taskPriority.value);
  els.taskForm.reset();
  els.taskPriority.value = 'medium';
  els.taskTitle.focus();
});

els.themeToggle.addEventListener('click', toggleTheme);
els.newQuoteBtn.addEventListener('click', () => showQuote());
els.clearCompletedBtn.addEventListener('click', clearCompleted);

els.filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

initTheme();
initAssets();
loadTasks();
showQuote(0);
renderTasks();

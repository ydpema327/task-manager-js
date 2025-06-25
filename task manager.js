
document.addEventListener('DOMContentLoaded', () => {
  // ── DOM cache ──────────────────────────────────────────
  const taskInput     = document.getElementById('task-input');
  const addTaskBtn    = document.getElementById('add-task');
  const taskList      = document.getElementById('task-list');
  const emptyMessage  = document.getElementById('empty-message');
  const filterBtns    = document.querySelectorAll('.filter-btn');

  // ── State ──────────────────────────────────────────────
  let tasks         = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentFilter = 'all';

  renderTasks();                           // draw tasks on first load

  // ── Add-task events ────────────────────────────────────
  addTaskBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  // ── Filter buttons ─────────────────────────────────────
  filterBtns.forEach((btn) =>
    btn.addEventListener('click', function () {
      filterBtns.forEach((b) => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.dataset.filter;            // “all” | “active” | “completed”
      renderTasks();
    })
  );

  // ── CRUD helpers ───────────────────────────────────────
  function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({ id: Date.now(), text, completed: false });
    taskInput.value = '';
    saveAndRender();
  }

  function toggleComplete(id) {
    tasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveAndRender();
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveAndRender();
  }

  function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }

  // ── UI renderer ────────────────────────────────────────
  function renderTasks() {
    taskList.innerHTML = '';

    let filtered = tasks;
    if (currentFilter === 'active')     filtered = tasks.filter((t) => !t.completed);
    if (currentFilter === 'completed')  filtered = tasks.filter((t) =>  t.completed);

    emptyMessage.style.display = filtered.length ? 'none' : 'block';

    filtered.forEach((task) => {
      const li       = document.createElement('li');
      li.className   = 'task-item';

      const span     = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.text;
      if (task.completed) span.classList.add('completed');

      const actions  = document.createElement('div');
      actions.className = 'task-actions';

      const completeBtn = document.createElement('button');
      completeBtn.className = 'complete-btn';
      completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
      completeBtn.addEventListener('click', () => toggleComplete(task.id));

      const deleteBtn   = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => deleteTask(task.id));

      actions.appendChild(completeBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(span);
      li.appendChild(actions);

      taskList.appendChild(li);
    });
  }
});

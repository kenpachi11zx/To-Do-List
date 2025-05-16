document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const taskCounter = document.getElementById('task-counter');
    
    let tasks = [];
    
    // Load tasks from localStorage
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            renderTasks();
        }
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTaskCounter();
    }
    
    // Render tasks to the DOM
    function renderTasks() {
        taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            taskList.innerHTML = `
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="12" y1="18" x2="12" y2="12"></line>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                    <p>No tasks yet. Add one above!</p>
                </div>
            `;
        } else {
            tasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.classList.add('task-item');
                if (task.completed) {
                    taskItem.classList.add('completed');
                }
                
                taskItem.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${task.text}</span>
                    <div class="task-actions">
                        <button class="btn btn-edit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn btn-delete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                `;
                
                taskList.appendChild(taskItem);
                
                // Add event listeners to the task item
                const checkbox = taskItem.querySelector('.task-checkbox');
                const editBtn = taskItem.querySelector('.btn-edit');
                const deleteBtn = taskItem.querySelector('.btn-delete');
                
                checkbox.addEventListener('change', () => {
                    task.completed = checkbox.checked;
                    if (checkbox.checked) {
                        taskItem.classList.add('completed');
                    } else {
                        taskItem.classList.remove('completed');
                    }
                    saveTasks();
                });
                
                editBtn.addEventListener('click', () => {
                    const taskText = taskItem.querySelector('.task-text');
                    const taskActions = taskItem.querySelector('.task-actions');
                    const currentText = task.text;
                    
                    // Replace with edit form
                    taskText.style.display = 'none';
                    taskActions.style.display = 'none';
                    
                    const editForm = document.createElement('div');
                    editForm.classList.add('edit-form');
                    editForm.innerHTML = `
                        <input type="text" class="edit-input" value="${currentText}">
                        <button class="btn btn-save">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                        </button>
                        <button class="btn btn-cancel">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    `;
                    
                    taskItem.insertBefore(editForm, taskText);
                    const editInput = editForm.querySelector('.edit-input');
                    editInput.focus();
                    
                    // Save button event
                    const saveBtn = editForm.querySelector('.btn-save');
                    saveBtn.addEventListener('click', () => {
                        const newText = editInput.value.trim();
                        if (newText) {
                            task.text = newText;
                            taskText.textContent = newText;
                            saveTasks();
                        }
                        
                        // Restore original view
                        editForm.remove();
                        taskText.style.display = '';
                        taskActions.style.display = '';
                    });
                    
                    // Cancel button event
                    const cancelBtn = editForm.querySelector('.btn-cancel');
                    cancelBtn.addEventListener('click', () => {
                        editForm.remove();
                        taskText.style.display = '';
                        taskActions.style.display = '';
                    });
                });
                
                deleteBtn.addEventListener('click', () => {
                    taskItem.style.opacity = '0';
                    taskItem.style.transform = 'translateX(30px)';
                    
                    setTimeout(() => {
                        tasks = tasks.filter(t => t.id !== task.id);
                        saveTasks();
                        renderTasks();
                    }, 300);
                });
            });
        }
        
        updateTaskCounter();
    }
    
    // Update task counter
    function updateTaskCounter() {
        if (tasks.length > 0) {
            const completedCount = tasks.filter(task => task.completed).length;
            taskCounter.innerHTML = `
                <span>${tasks.length} task${tasks.length !== 1 ? 's' : ''}</span>
                <span>${completedCount} completed</span>
            `;
            taskCounter.style.display = 'flex';
        } else {
            taskCounter.style.display = 'none';
        }
    }
    
    // Add a new task
    function addTask(text) {
        const task = {
            id: Date.now().toString(),
            text: text,
            completed: false
        };
        
        tasks.unshift(task); // Add to beginning of array
        saveTasks();
        renderTasks();
    }
    
    // Form submit event
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        
        if (text) {
            addTask(text);
            taskInput.value = '';
            taskInput.focus();
        }
    });
    
    // Initialize
    loadTasks();
});
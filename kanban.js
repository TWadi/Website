// Enhanced drag and drop with task creation

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'kanbanBoard';
    let draggedTask = null;

    function attachDragEvents(task) {
        task.draggable = true;
        task.addEventListener('dragstart', () => {
            draggedTask = task;
            task.classList.add('dragging');
        });
        task.addEventListener('dragend', () => {
            draggedTask = null;
            task.classList.remove('dragging');
            saveBoard();
        });
    }

    function saveBoard() {
        const board = {
            todo: Array.from(document.querySelectorAll('#todo .task')).map(t => ({ id: t.dataset.id, text: t.textContent })),
            inProgress: Array.from(document.querySelectorAll('#in-progress .task')).map(t => ({ id: t.dataset.id, text: t.textContent })),
            done: Array.from(document.querySelectorAll('#done .task')).map(t => ({ id: t.dataset.id, text: t.textContent }))
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
    }

    function loadBoard() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            todo: [
                { id: 't1', text: 'Draft project vision' },
                { id: 't2', text: 'Set up continuous integration' }
            ],
            inProgress: [
                { id: 't3', text: 'Design database schema' }
            ],
            done: []
        };
    }

    function renderBoard(board) {
        const mapping = { todo: 'todo', inProgress: 'in-progress', done: 'done' };
        Object.keys(mapping).forEach(key => {
            const column = document.getElementById(mapping[key]);
            column.querySelectorAll('.task').forEach(t => t.remove());
            board[key].forEach(task => {
                const el = document.createElement('div');
                el.className = 'task';
                el.textContent = task.text;
                el.dataset.id = task.id;
                attachDragEvents(el);
                column.appendChild(el);
            });
        });
    }

    const board = loadBoard();
    renderBoard(board);

    document.querySelectorAll('.kanban-column').forEach(column => {
        column.addEventListener('dragover', e => e.preventDefault());
        column.addEventListener('drop', e => {
            e.preventDefault();
            if (draggedTask) {
                column.appendChild(draggedTask);
                saveBoard();
            }
        });
    });

    const input = document.getElementById('new-task');
    const addButton = document.getElementById('add-task');
    if (addButton) {
        addButton.addEventListener('click', () => {
            const text = input.value.trim();
            if (!text) return;
            const task = document.createElement('div');
            task.className = 'task';
            task.textContent = text;
            task.dataset.id = Date.now().toString();
            attachDragEvents(task);
            document.getElementById('todo').appendChild(task);
            input.value = '';
            saveBoard();
        });
    }

    // initial save to ensure defaults persist
    saveBoard();
});

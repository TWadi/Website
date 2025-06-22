// Enhanced drag and drop with task creation

document.addEventListener('DOMContentLoaded', () => {
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
        });
    }

    document.querySelectorAll('.task').forEach(attachDragEvents);

    document.querySelectorAll('.kanban-column').forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        column.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedTask) {
                column.appendChild(draggedTask);
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
            attachDragEvents(task);
            document.getElementById('todo').appendChild(task);
            input.value = '';
        });
    }
});

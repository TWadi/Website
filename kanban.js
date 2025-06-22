// Simple drag and drop functionality for the Kanban board

document.addEventListener('DOMContentLoaded', () => {
    let draggedTask = null;

    document.querySelectorAll('.task').forEach(task => {
        task.draggable = true;

        task.addEventListener('dragstart', () => {
            draggedTask = task;
            task.classList.add('dragging');
        });

        task.addEventListener('dragend', () => {
            draggedTask = null;
            task.classList.remove('dragging');
        });
    });

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
});

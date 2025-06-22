// Simple ticket manager with delete functionality

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('ticket-table').querySelector('tbody');
    const addBtn = document.getElementById('add-ticket');
    const input = document.getElementById('new-ticket');
    const STORAGE_KEY = 'tickets';

    function saveTickets() {
        const tickets = Array.from(tableBody.querySelectorAll('tr td:first-child')).map(td => td.textContent);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    }

    function addRow(text) {
        const row = document.createElement('tr');
        const tdText = document.createElement('td');
        tdText.textContent = text;
        const tdAction = document.createElement('td');
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.className = 'delete';
        delBtn.addEventListener('click', () => {
            row.remove();
            saveTickets();
        });
        tdAction.appendChild(delBtn);
        row.appendChild(tdText);
        row.appendChild(tdAction);
        tableBody.appendChild(row);
        saveTickets();
    }

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const text = input.value.trim();
            if (!text) return;
            addRow(text);
            input.value = '';
        });
    }

    // Load existing tickets from storage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        JSON.parse(stored).forEach(addRow);
    }

    // Attach delete handlers for existing rows
    tableBody.querySelectorAll('.delete').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('tr').remove();
            saveTickets();
        });
    });
});

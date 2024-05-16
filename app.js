function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const totalAmount = document.getElementById('totalAmount');
const searchInput = document.getElementById('searchInput');

let total = 0;
let expenses = [];

window.addEventListener('load', () => {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses'));
    if (storedExpenses) {
        expenses = storedExpenses;
        renderExpenses();
    }
});

function renderExpenses() {
    expenseList.innerHTML = '';
    total = 0;

    expenses.forEach((expense, index) => {
        const { description, amount, type, date } = expense;
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${description}</span>
            <span>$${amount}</span>
            <span class="${type === 'expense' ? 'expense' : 'income'}">${type === 'expense' ? 'Expense' : 'Income'}</span>
            <span>${date}</span>
            <div class="actions">
                <button onclick="editExpense(${index})">Edit</button>
                <button onclick="deleteExpense(${index})">Delete</button>
            </div>
        `;
        expenseList.appendChild(listItem);
        total += parseFloat(amount) * (type === 'expense' ? -1 : 1);
    });

    totalAmount.textContent = total.toFixed(2);
}

expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (description && !isNaN(amount)) {
        const newExpense = {
            description,
            amount,
            type,
            date: getCurrentDate()
        };
        expenses.push(newExpense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();

        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
    }
});

function editExpense(index) {
    const editedDescription = prompt('Enter new description:');
    const editedAmount = parseFloat(prompt('Enter new amount:'));

    if (editedDescription && !isNaN(editedAmount)) {
        expenses[index].description = editedDescription;
        expenses[index].amount = editedAmount;
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    }
}

function deleteExpense(index) {
    const confirmDelete = confirm('Are you sure you want to delete this expense?');

    if (confirmDelete) {
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    }
}

searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredExpenses = expenses.filter(expense => {
        return expense.description.toLowerCase().includes(searchTerm);
    });

    expenseList.innerHTML = '';
    filteredExpenses.forEach((expense, index) => {
        const { description, amount, type, date } = expense;
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${description}</span>
            <span>$${amount}</span>
            <span class="${type === 'expense' ? 'expense' : 'income'}">${type === 'expense' ? 'Expense' : 'Income'}</span>
            <span>${date}</span>
            <div class="actions">
                <button onclick="editExpense(${index})">Edit</button>
                <button onclick="deleteExpense(${index})">Delete</button>
            </div>
        `;
        expenseList.appendChild(listItem);
    });

    const totalFiltered = filteredExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount) * (curr.type === 'expense' ? -1 : 1), 0);
    totalAmount.textContent = totalFiltered.toFixed(2);
});

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

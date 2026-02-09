const form = document.getElementById('user-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const refreshBtn = document.getElementById('refresh-btn');
const tableBody = document.querySelector('#users-table tbody');
const emptyState = document.getElementById('empty-state');
const formTitle = document.getElementById('form-title');

let editingId = null;
let cachedUsers = [];

function setFormMode(user) {
  if (user) {
    editingId = user.id;
    formTitle.textContent = 'Update User';
    submitBtn.textContent = 'Update';
    cancelBtn.disabled = false;
    nameInput.value = user.name;
    emailInput.value = user.email;
  } else {
    editingId = null;
    formTitle.textContent = 'Create User';
    submitBtn.textContent = 'Create';
    cancelBtn.disabled = true;
    form.reset();
  }
}

function renderUsers(users) {
  tableBody.innerHTML = '';
  if (!users.length) {
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';

  users.forEach((user) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${new Date(user.created_at).toLocaleString()}</td>
      <td>
        <button class="ghost" data-action="edit" data-id="${user.id}">Edit</button>
        <button class="ghost" data-action="delete" data-id="${user.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

async function fetchUsers() {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Failed to load users');
  }
  cachedUsers = await response.json();
  renderUsers(cachedUsers);
}

async function createUser(payload) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create user');
  }
  return response.json();
}

async function updateUser(id, payload) {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update user');
  }
  return response.json();
}

async function deleteUser(id) {
  const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete user');
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim()
  };

  try {
    if (editingId) {
      await updateUser(editingId, payload);
    } else {
      await createUser(payload);
    }
    setFormMode(null);
    await fetchUsers();
  } catch (error) {
    alert(error.message);
  }
});

cancelBtn.addEventListener('click', () => setFormMode(null));
refreshBtn.addEventListener('click', () => fetchUsers().catch((error) => alert(error.message)));

tableBody.addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button) {
    return;
  }
  const id = Number(button.dataset.id);
  if (button.dataset.action === 'edit') {
    const user = cachedUsers.find((item) => item.id === id);
    if (user) {
      setFormMode(user);
    }
  }
  if (button.dataset.action === 'delete') {
    const confirmed = confirm('Delete this user?');
    if (!confirmed) {
      return;
    }
    try {
      await deleteUser(id);
      await fetchUsers();
    } catch (error) {
      alert(error.message);
    }
  }
});

fetchUsers().catch((error) => {
  emptyState.textContent = error.message;
  emptyState.style.display = 'block';
});

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// =======================
// RDS DATABASE CONNECTION
// =======================
const db = mysql.createConnection({
  host: 'localhost',   // or '127.0.0.1'
  user: 'root',
  password: 'root',    // whatever password you set locally
  database: 'world',
  port: 3306           // default MySQL port
});


// Connect to RDS
db.connect((err) => {
  if (err) {
    console.error('❌ RDS connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to AWS RDS');
});

// =======================
// ADD USER
// =======================
app.post('/add-user', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.send('Name and Email are required');
  }

  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(sql, [name, email], (err) => {
    if (err) {
      console.error('Insert error:', err.message);
      return res.status(500).send('Failed to insert user');
    }
    res.redirect('/');
  });
});

// =======================
// LIST USERS
// =======================
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Fetch error:', err.message);
      return res.status(500).send('Failed to fetch users');
    }

    let html = `
<!DOCTYPE html>
<html>
<head>
  <title>Users List</title>
  <style>
    body {
      margin: 0;
      padding: 30px;
      font-family: Arial, Helvetica, sans-serif;
      background: linear-gradient(135deg, #141e30, #243b55);
    }
    .container {
      background: #ffffff;
      max-width: 950px;
      margin: auto;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.3);
    }
    h2 {
      text-align: center;
      margin-bottom: 25px;
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background: #243b55;
      color: #ffffff;
      padding: 12px;
    }
    td {
      padding: 10px;
      text-align: center;
      border-bottom: 1px solid #ddd;
    }
    tr:hover {
      background: #f4f6f8;
    }
    .btn {
      padding: 6px 12px;
      border-radius: 4px;
      text-decoration: none;
      font-size: 13px;
      color: white;
    }
    .edit {
      background: #2980b9;
    }
    .delete {
      background: #c0392b;
    }
    .edit:hover {
      background: #1f618d;
    }
    .delete:hover {
      background: #922b21;
    }
    .back {
      text-align: center;
      margin-top: 25px;
    }
    .back a {
      text-decoration: none;
      background: #243b55;
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: bold;
    }
  </style>
</head>
<body>

<div class="container">
  <h2>Users Stored in AWS RDS</h2>

  <table>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Email</th>
      <th>Action</th>
    </tr>`;

    results.forEach(user => {
      html += `
    <tr>
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <a href="/edit-user/${user.id}" class="btn edit">Edit</a>
        <a href="/delete-user/${user.id}" class="btn delete"
           onclick="return confirm('Are you sure you want to delete this user?')">
           Delete
        </a>
      </td>
    </tr>`;
    });

    html += `
  </table>

  <div class="back">
    <a href="/">⬅ Back to Home</a>
  </div>
</div>

</body>
</html>`;

    res.send(html);
  });
});

// =======================
// EDIT USER (FORM)
// =======================
app.get('/edit-user/:id', (req, res) => {
  const userId = req.params.id;

  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err || results.length === 0) {
      return res.send('User not found');
    }

    const user = results[0];

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Edit User</title>
  <style>
    body {
      margin: 0;
      height: 100vh;
      font-family: Arial, Helvetica, sans-serif;
      background: linear-gradient(135deg, #141e30, #243b55);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .card {
      background: #ffffff;
      padding: 30px;
      width: 380px;
      border-radius: 12px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.3);
      text-align: center;
    }
    input {
      width: 100%;
      padding: 12px;
      margin: 10px 0;
      border-radius: 6px;
      border: 1px solid #ccc;
    }
    button {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 6px;
      background: #2980b9;
      color: white;
      font-size: 15px;
      cursor: pointer;
    }
    a {
      display: block;
      margin-top: 15px;
      text-decoration: none;
      color: #2980b9;
    }
  </style>
</head>
<body>

<div class="card">
  <h2>Edit User</h2>

  <form action="/update-user" method="POST">
    <input type="hidden" name="id" value="${user.id}">
    <input type="text" name="name" value="${user.name}" required>
    <input type="email" name="email" value="${user.email}" required>
    <button type="submit">Update User</button>
  </form>

  <a href="/users">⬅ Back to Users</a>
</div>

</body>
</html>`;

    res.send(html);
  });
});

// =======================
// UPDATE USER
// =======================
app.post('/update-user', (req, res) => {
  const { id, name, email } = req.body;

  const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  db.query(sql, [name, email, id], (err) => {
    if (err) {
      console.error('Update error:', err.message);
      return res.status(500).send('Failed to update user');
    }
    res.redirect('/users');
  });
});

// =======================
// DELETE USER
// =======================
app.get('/delete-user/:id', (req, res) => {
  const userId = req.params.id;

  db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
    if (err) {
      console.error('Delete error:', err.message);
      return res.status(500).send('Failed to delete user');
    }
    res.redirect('/users');
  });
});

// =======================
// HEALTH CHECK
// =======================
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// =======================
// START SERVER
// =======================
app.listen(5000, '0.0.0.0', () => {
  console.log('🚀 Server running on port 5000');
});
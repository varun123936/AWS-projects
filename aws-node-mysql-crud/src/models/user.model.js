const db = require('../config/db');

async function getAll() {
  const [rows] = await db.query(
    'SELECT id, name, email, created_at FROM users1 ORDER BY id DESC'
  );
  return rows;
}

async function getById(id) {
  const [rows] = await db.query(
    'SELECT id, name, email, created_at FROM users1 WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function create(user) {
  const [result] = await db.query(
    'INSERT INTO users1 (name, email) VALUES (?, ?)',
    [user.name, user.email]
  );
  return getById(result.insertId);
}

async function update(id, user) {
  const [result] = await db.query(
    'UPDATE users1 SET name = ?, email = ? WHERE id = ?',
    [user.name, user.email, id]
  );
  return {
    affectedRows: result.affectedRows,
    user: await getById(id)
  };
}

async function remove(id) {
  const [result] = await db.query(
    'DELETE FROM users1 WHERE id = ?',
    [id]
  );
  return result.affectedRows;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};

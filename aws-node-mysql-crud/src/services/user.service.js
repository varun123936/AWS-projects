const userModel = require('../models/user.model');

function validateUserPayload(payload) {
  if (!payload || !payload.name || !payload.email) {
    const error = new Error('Name and email are required');
    error.status = 400;
    throw error;
  }
}

async function listUsers() {
  return userModel.getAll();
}

async function getUserById(id) {
  const user = await userModel.getById(id);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  return user;
}

async function createUser(payload) {
  validateUserPayload(payload);
  return userModel.create(payload);
}

async function updateUser(id, payload) {
  validateUserPayload(payload);
  const result = await userModel.update(id, payload);
  if (result.affectedRows === 0) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  return result.user;
}

async function deleteUser(id) {
  const affectedRows = await userModel.remove(id);
  if (affectedRows === 0) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  return { deleted: true };
}

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};

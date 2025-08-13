const { mySqlQury } = require("../middleware/db");
const { getClientParentInfo, is_user_allowed } = require("./userContext");


async function getEffectiveUserId(req) {
  const { id: currentUserId, is_client } = req.user;
  let selectedUser = req.query?.selectedUser || req.body?.selectedUser;
  let userId = selectedUser || currentUserId;

  if (currentUserId !== 1 && selectedUser) {
    const isAllowed = await is_user_allowed(req, true);
    if (!isAllowed) {
      throw new Error("403:User access not allowed");
    }
  }

  if (!is_client) {
    const result = await getClientParentInfo(userId);
    userId = result.parent_id;
  }

  return userId;
}

async function safeInsertRole(name, clientId) {
  if (!name || name.trim() === '') {
    throw new Error("400:Role name is required");
  }

  try {
    const query = 'INSERT INTO roles (name, description, client_id) VALUES (?, ?, ?)';
    return await mySqlQury(query, [name.trim(), '[]', clientId]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      throw new Error("409:A role with this name already exists.");
    }
    throw error;
  }
}

module.exports = {
  getEffectiveUserId,
  safeInsertRole
};

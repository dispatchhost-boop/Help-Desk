const { mySqlQury } = require("../middleware/db");
const getNestedUserIds = require("./getNestedUserIds");

function extractUserId(req) {
  const selectedUser =
    req.query?.selectedUser ||
    req.params?.selectedUser ||
    req.body?.selectedUser;

  return selectedUser || null; // return null if not found
}
const getAllowedUserContext = async (req, includeOwner) => {
  const { is_client, id } = req.user;

  const userContext = {
    is_super_admin: 0,
    is_client: is_client ? 1 : 0,
    allowed_users: [],
  };

  // Super Admin check
  if (id === 1) {
    userContext.is_super_admin = 1;
    return userContext;
  }

  // Internal user (non-client)
  if (!is_client) {
    userContext.allowed_users.push(id);
  }

  // Client user
  if (is_client) {
    const nestedIds = await getNestedUserIds(id);
    userContext.allowed_users = nestedIds;
    if(includeOwner){
        userContext.allowed_users.push(id)
    }
  }

  return userContext;
};

const is_user_allowed = async ( requester , targetUser) => {
    const allowedUserList = await getNestedUserIds(requester);
    if (allowedUserList.includes(Number(targetUser))) {
      return true;
    }
  return false;
};

async function getClientParentInfo(userId) {
  console.log(userId);
  
  const query = `
    SELECT id, is_client, parent_id
    FROM tbl_admin
    WHERE id = ?
    LIMIT 1
  `;

  try {
    const [user] = await mySqlQury(query, [userId]);
    const [parent] = await mySqlQury('select level from tbl_admin where id=? LIMIT 1',[user.id])
    if (!user) {
      throw new Error("User not found.");
    }

    return {
      is_client: !!user.is_client,
      parent_id: user.parent_id || null,
      level: user.level,
      parentLevel : parent.level
    };
  } catch (error) {
    console.error("Error in getClientParentInfo:", error);
    throw error;
  }
}

module.exports = {is_user_allowed, getAllowedUserContext, getClientParentInfo}
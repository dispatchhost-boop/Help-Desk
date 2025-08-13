const { mySqlQury } = require("../middleware/db");

async function getNestedUserIds(ownerId) {
  const query = `
    WITH RECURSIVE nested_users AS (
      SELECT id
      FROM tbl_admin
      WHERE parent_id = ?

      UNION ALL

      SELECT a.id
      FROM tbl_admin a
      INNER JOIN nested_users nu ON a.parent_id = nu.id
    )
    SELECT id FROM nested_users
  `;

  try {
    const results = await mySqlQury(query, [ownerId]);
    return results.map(row => row.id);
  } catch (error) {
    console.error("Error fetching nested users:", error);
    throw error;
  }
}

//  get all users of client
const getNestedUsersByClientIds = async (clinetId) => {
  try {
    const query = `
      SELECT id, parent_id, level,
             CONCAT(first_name, ' ', last_name) AS full_name
      FROM tbl_admin
      WHERE parent_id = ? 
        AND level = 4
    `;

    const users = await mySqlQury(query, [clientId]);
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

let getNestedChildClients = async (selectedParentId) => {

  try {
    // Only client or allowed user can see sub-clients
    const query = `
      WITH RECURSIVE nested_users AS (
          -- 1️⃣ Include itself first
          SELECT id, parent_id, level, CONCAT(first_name, ' ', last_name) AS full_name
          FROM tbl_admin
          WHERE id = ?

          UNION ALL

          -- 2️⃣ Include all nested children (level 2 and 3)
          SELECT a.id, a.parent_id, a.level, CONCAT(a.first_name, ' ', a.last_name) AS full_name
          FROM tbl_admin a
          INNER JOIN nested_users nu ON a.parent_id = nu.id
          WHERE a.level IN (2,3)
      )
      -- 3️⃣ Final selection
      SELECT id, parent_id, level, full_name
      FROM nested_users;
    `;

    const clients = await mySqlQury(query, [selectedParentId]);
    res.json({ clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
}
module.exports = {getNestedUserIds, getNestedChildClients, getNestedUsersByClientIds};
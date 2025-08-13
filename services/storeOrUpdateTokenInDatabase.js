const { mySqlQury } = require("../middleware/db");
async function storeOrUpdateTokenInDatabase(token, expiryTime) {
  try {
    const result = await mySqlQury('SELECT COUNT(*) AS count FROM delivery_api_tokens');

    if (result.length > 0 && result[0].count > 0) {
      // Step 1: Retrieve the latest token ID
      const tokenRecord = await mySqlQury('SELECT id FROM delivery_api_tokens ORDER BY expiry_time DESC LIMIT 1');

      if (tokenRecord.length > 0) {
        const latestId = tokenRecord[0].id;

        // Step 2: Update the token for the retrieved ID
        await mySqlQury('UPDATE delivery_api_tokens SET token = ?, expiry_time = ? WHERE id = ?', [token, expiryTime, latestId]);
        console.log("Updated existing token with ID:", latestId);
      } else {
        console.error("No valid token record found to update.");
      }
    } else {
      // Insert a new token if no records exist
      await mySqlQury('INSERT INTO delivery_api_tokens (token, expiry_time) VALUES (?, ?)', [token, expiryTime]);
      console.log("Inserted a new token into the database.");
    }
  } catch (error) {
    console.error("Error in storeOrUpdateTokenInDatabase:", error);
  }
}

module.exports = storeOrUpdateTokenInDatabase
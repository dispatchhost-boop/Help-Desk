const { mySqlQury } = require("../middleware/db");
const fetchDelhiveryApiToken = require("./fetchDelhiveryApiToken");
async function getTokenFromDatabase() {
  const results = await mySqlQury('SELECT token, expiry_time FROM delivery_api_tokens ORDER BY expiry_time DESC LIMIT 1');
  return results[0]; // Return the latest token
}

let deliveryApi = null;
let tokenExpiry = null;

// Function to fetch the token from Delhivery
async function getValidDeliveryApiToken() {
  // Check the database for a valid token
  const tokenData = await getTokenFromDatabase();
  if (tokenData && Date.now() < new Date(tokenData.expiry_time).getTime()) {
    console.log("Using token from database.");
     deliveryApi = tokenData.token;
    tokenExpiry = new Date(tokenData.expiry_time).getTime();
  } else {
    console.log("Token expired or not available. Fetching a new token...");
    await fetchDelhiveryApiToken(); // Fetch a new token if expired
  }
  
  return deliveryApi;
}

module.exports = getValidDeliveryApiToken
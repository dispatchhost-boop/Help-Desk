const axios = require("axios");
const storeOrUpdateTokenInDatabase = require("./storeOrUpdateTokenInDatabase");
async function fetchDelhiveryApiToken() {
  console.log("In fetch delivery");

  try {
    const res = await axios.post(process.env.DELHIVERY_API_URL, {
      username: process.env.DELHIVERY_USERNAME,
      password: process.env.DELHIVERY_PASSWORD
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // console.log("Response in login:", res);

    if (res.data.success) {
      const token = res.data.data.jwt;
      console.log("Token is here:", token);
      deliveryApi = token;
      tokenExpiry = Date.now() + 10 * 60 * 60 * 1000; // Token is valid for 10 hours

      // Store or update the token in the database
      await storeOrUpdateTokenInDatabase(token, new Date(tokenExpiry));
      console.log("New Delhivery API Token stored in database: ", token);
    } else {
      console.error("Failed to authenticate with Delhivery API:", res.data.error.message);
    }
  } catch (error) {
    console.error("Error fetching the token:", error);
  }
}

module.exports = fetchDelhiveryApiToken
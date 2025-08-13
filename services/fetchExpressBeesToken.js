const axios = require("axios");
const fetchExpressBeesToken = async () => {
  try {
    const response = await axios.post(process.env.EXPRESSBEES_API_URL, {
      email: process.env.EXPRESSBEES_EMAIL,
      password: process.env.EXPRESSBEES_PASSWORD
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Assuming the token is in response.data.data
    const token = response.data.data;
    return token;
  } catch (error) {
    console.error("Error fetching ExpressBees token:", error);
    return null;
  }
};

module.exports = fetchExpressBeesToken
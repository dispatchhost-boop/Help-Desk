const axios = require("axios");
const fetchExpressBeesToken = require("./fetchExpressBeesToken");
const { mySqlQury } = require("../middleware/db");
async function checkServiceability(taggedApi, pickupPincode, destinationPincode, weight, paymentType, orderAmount, weight_unit) {
  try {
    let serviceable = false;
    console.log("in the check serviceability",taggedApi,pickupPincode,destinationPincode,weight,paymentType,orderAmount,weight_unit)

    // Convert weight to grams if it's in kg
    const weightInGrams = weight_unit === 'kg' ? Number(weight) * 1000 : Number(weight);
    console.log("weight in grams:", weightInGrams);
    const cleanTaggedApi = taggedApi.toLowerCase();
    // Example for ExpressBee
    if (taggedApi === 'expressbees') {
      const expressBeesToken = await fetchExpressBeesToken(); // Fetch the token as needed

      // Set request body based on payment type
      const requestBody = {
        origin: pickupPincode,
        destination: destinationPincode,
        payment_type: paymentType.toLowerCase() === 'cod' ? 'cod' : 'prepaid',
        order_amount: orderAmount,
        weight: weightInGrams
      };
      console.log("request body",requestBody)

      const response = await axios.post('https://shipment.xpressbees.com/api/courier/serviceability', requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${expressBeesToken}`
        }
      });
      console.log("result in the expressbees",response.data)
      
      // Check if response has data and it's an array
      if (response.data.status === true && Array.isArray(response.data.data)) {
        // If the API returns any data with status true, consider it serviceable
        // The presence of any ID in the response means the route is serviceable
        serviceable = response.data.data.length > 0;
        console.log("ExpressBees API returned data:", response.data.data);
      } else {
        serviceable = false;
      }
      console.log("ExpressBees serviceability result:", serviceable);
    }
    // Example for Delhivery
    else if (cleanTaggedApi === 'delhivery') {
      const token = process.env.DELHIVERY_STD;
      console.log("delivery in delivery")
      // Check serviceability for pickup pincode
      const pickupResponse = await axios.get('https://track.delhivery.com/c/api/pin-codes/json/', {
        params: {
          token: token,
          filter_codes: pickupPincode
        }
      });
      console.log("in delhivery servisibility", pickupResponse.data.delivery_codes)
      const isPickupServiceable = pickupResponse.data.delivery_codes.length > 0;

      // Check serviceability for destination pincode
      const destinationResponse = await axios.get('https://track.delhivery.com/c/api/pin-codes/json/', {
        params: {
          token: token,
          filter_codes: destinationPincode
        }
      });
      console.log("in delhivery servisibility", destinationResponse.data.delivery_codes)
      const isDestinationServiceable = destinationResponse.data.delivery_codes.length > 0;

      // Both pincodes must be serviceable
      serviceable = isPickupServiceable && isDestinationServiceable;
    }
    console.log("in the servisibility pincode servise",serviceable)
    return serviceable;
  } catch (error) {
    console.error(`Error checking serviceability for ${taggedApi}:`, error);
    return false; // Treat as non-serviceable on error
  }
}


module.exports = checkServiceability
const { mySqlQury } = require("../middleware/db");


async function checkOdaStatus(forwarderTaggedApi, pickupPincode, destinationPincode) {
  let odaCount = 0;
  console.log("in the check oda status",forwarderTaggedApi,pickupPincode,destinationPincode)
  
  try {
    if (forwarderTaggedApi.toLowerCase() === 'delhivery') {
      // Check pickup pincode in Delhivery ODA table
      const pickupOdaResult = await mySqlQury(
        `SELECT ODA FROM tbl_delivery_ltl WHERE Pin = ?`,
        [pickupPincode]
      );
      
      // Check destination pincode in Delhivery ODA table
      const destinationOdaResult = await mySqlQury(
        `SELECT ODA FROM tbl_delivery_ltl WHERE Pin = ?`,
        [destinationPincode]
      );
      
      // Count how many pincodes are in ODA areas
      if (pickupOdaResult.length > 0 && pickupOdaResult[0].ODA === 'TRUE') {
        odaCount += 1;
      }
      
      if (destinationOdaResult.length > 0 && destinationOdaResult[0].ODA === 'TRUE') {
        odaCount += 1;
      }
      
      console.log(`Delhivery ODA check - Pickup: ${pickupOdaResult.length > 0 ? pickupOdaResult[0].ODA : 'Not found'}, Destination: ${destinationOdaResult.length > 0 ? destinationOdaResult[0].ODA : 'Not found'}, ODA Count: ${odaCount}`);
    } 
    else if (forwarderTaggedApi.toLowerCase() === 'dtdc') {
      // Check pickup pincode in DTDC ODA table
      const pickupOdaResult = await mySqlQury(
        `SELECT oda_category FROM tbl_dtdc_ltl WHERE pincode = ?`,
        [pickupPincode]
      );
      
      // Check destination pincode in DTDC ODA table
      const destinationOdaResult = await mySqlQury(
        `SELECT oda_category FROM tbl_dtdc_ltl WHERE pincode = ?`,
        [destinationPincode]
      );
      
      // Check if pickup pincode is in ODA category
      if (pickupOdaResult.length > 0) {
        const odaCategory = pickupOdaResult[0].oda_category;
        if (['ODA I', 'ODA II', 'ODA III', 'ODA IV'].includes(odaCategory)) {
          odaCount += 1;
        }
      }
      
      // Check if destination pincode is in ODA category
      if (destinationOdaResult.length > 0) {
        const odaCategory = destinationOdaResult[0].oda_category;
        if (['ODA I', 'ODA II', 'ODA III', 'ODA IV'].includes(odaCategory)) {
          odaCount += 1;
        }
      }
      
      console.log(`DTDC ODA check - Pickup: ${pickupOdaResult.length > 0 ? pickupOdaResult[0].oda_category : 'Not found'}, Destination: ${destinationOdaResult.length > 0 ? destinationOdaResult[0].oda_category : 'Not found'}, ODA Count: ${odaCount}`);
    }
    // You can add more forwarders here as needed
    
    return odaCount;
  } catch (error) {
    console.error(`Error checking ODA status for ${forwarderTaggedApi}:`, error);
    return 0; // Return 0 in case of error
  }
}
module.exports = checkOdaStatus
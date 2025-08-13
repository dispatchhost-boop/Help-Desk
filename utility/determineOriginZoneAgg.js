const { mySqlQury } = require("../middleware/db");

async function determineOriginZoneAggregator(aggregatorId, pickupCity, destinationCity, pickupState, destinationState, pickupZone, destinationZone) {
  console.log("Determining origin zone for aggregator", { 
    aggregatorId, pickupCity, destinationCity, pickupZone, destinationZone 
  });
  
  let originZone = null;
  
  // Step 1: Check 'WITHIN-NCR' rule for both pickupCity and destinationCity
  let zoneResult = await mySqlQury(
    `SELECT city, zone 
     FROM tbl_std_agg_zone_map 
     WHERE aggrigator_id = ? 
       AND rule = 'WITHIN-NCR' 
       AND city IN (?, ?)`,
    [aggregatorId, pickupCity, destinationCity]
  );
  
  // Ensure both cities exist in the result
  const matchedCities = zoneResult.map(row => row.city);
  if (matchedCities.includes(pickupCity) && matchedCities.includes(destinationCity)) {
    originZone = zoneResult[0].zone; // Assign the zone if both cities are present
  }
  
  console.log("Origin zone from WITHIN-NCR: ", originZone);

  // Step 2: If originZone is still null, check 'WITHIN-CITY' rule (when pickupCity is same as destinationCity)
  if (!originZone && pickupCity === destinationCity) {
    zoneResult = await mySqlQury(
      `SELECT zone 
       FROM tbl_std_agg_zone_map 
       WHERE aggrigator_id = ? 
         AND rule = 'WITHIN-CITY'`,
      [aggregatorId]
    );
    originZone = zoneResult.length > 0 ? zoneResult[0].zone : null;
    console.log("Origin zone from WITHIN-CITY: ", originZone);
  }
  
  // Step 3: If originZone is still null, check 'WITHIN-STATE' rule
  if (!originZone && pickupState === destinationState) {
    zoneResult = await mySqlQury(
      `SELECT zone 
       FROM tbl_std_agg_zone_map 
       WHERE aggrigator_id = ? 
         AND rule = 'WITHIN-STATE'`,
      [aggregatorId]
    );
    originZone = zoneResult.length > 0 ? zoneResult[0].zone : null;
    console.log("Origin zone from WITHIN-STATE: ", originZone);
  }

  // Step 4: If still no zone found, check 'WITHIN-ZONE' rule using pickupZone and destinationZone
  if (!originZone && pickupZone === destinationZone) {
    zoneResult = await mySqlQury(
      `SELECT zone 
       FROM tbl_std_agg_zone_map 
       WHERE aggrigator_id = ? 
         AND rule = 'WITHIN-ZONE'`,
      [aggregatorId]
    );
    originZone = zoneResult.length > 0 ? zoneResult[0].zone : null;
    console.log("Origin zone from WITHIN-ZONE: ", originZone);
  }

  // Step 5: If still no zone found, check 'WITHIN-METRO' rule using destinationCity
  if (!originZone) {
    zoneResult = await mySqlQury(
      `SELECT zone 
       FROM tbl_std_agg_zone_map 
       WHERE aggrigator_id = ? 
         AND rule = 'WITHIN-METRO' 
         AND city = ?`,
      [aggregatorId, destinationCity]
    );
    originZone = zoneResult.length > 0 ? zoneResult[0].zone : null;
    console.log("Origin zone from WITHIN-METRO: ", originZone);
  }

  // Step 6: If still no zone found, check 'WITHIN-SPECIAL-ZONE' using pickupState or destinationState
  if (!originZone) {
    zoneResult = await mySqlQury(
      `SELECT zone 
       FROM tbl_std_agg_zone_map 
       WHERE aggrigator_id = ? 
         AND rule = 'WITHIN-SPECIAL-ZONE' 
         AND (state = ? OR state = ?)`,
      [aggregatorId, pickupState, destinationState]
    );
    originZone = zoneResult.length > 0 ? zoneResult[0].zone : null;
    console.log("Origin zone from WITHIN-SPECIAL-ZONE: ", originZone);
  }

  // Step 7: If still no zone found, check 'WITHIN-ROI' rule
  if (!originZone) {
    zoneResult = await mySqlQury(
      `SELECT zone 
       FROM tbl_std_agg_zone_map 
       WHERE aggrigator_id = ? 
         AND rule = 'WITHIN-ROI'`,
      [aggregatorId]
    );
    originZone = zoneResult.length > 0 ? zoneResult[0].zone : null;
    console.log("Origin zone from WITHIN-ROI: ", originZone);
  }

  return originZone;
}
module.exports = determineOriginZoneAggregator
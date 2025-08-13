const { mySqlQury } = require("../middleware/db");

async function findRateAggrigator(aggid, originZone, weight,maxWeight) {
  console.log("Finding Rate for Aggregator", { aggid, originZone, weight });

  try {
    // Step 1: Get linked courier_id (forwarder)
    const courierMap = await mySqlQury(
      `SELECT courier_id FROM tbl_logistics_partner WHERE id = ?`,
      [aggid]
    );
    if (!courierMap.length) {
      console.error("No forwarder mapped for aggregator:", aggid);
      return { rate: null, maxWeight: null };
    }
    const courierId = courierMap[0].courier_id;

    // Step 2: Use forwarder's logic to find the maxWeight
 

    // Step 3: Get aggregator-specific base rate for zone
    const aggZoneRate = await mySqlQury(
      `SELECT zone_value FROM tbl_exp_lp_zones_rates 
       WHERE lp_id = ? AND zone_name = ?`,
      [aggid, originZone]
    );
    if (!aggZoneRate.length) {
      console.error("No aggregator zone base rate found.");
      return { rate: null, maxWeight: null };
    }
    const baseRate = Number(aggZoneRate[0].zone_value);
    console.log("Aggregator base rate:", baseRate);

    // Step 4: Calculate extra weight
    const weightInKg = weight / 1000;
    const extraWeightInKg = weightInKg - maxWeight;
    if (extraWeightInKg <= 0) {
      console.log("Within base slab. Final rate = baseRate:", baseRate);
      return { rate: baseRate, maxWeight };
    }

    // Step 5: Fetch aggregator slab-additional charges
    const addChargeResult = await mySqlQury(
      `SELECT amount FROM tbl_exp_lp_slab_add_charges 
       WHERE lp_id = ? AND zone_name = ?`,
      [aggid, originZone]
    );

    let extraCharge = 0;
    if (addChargeResult.length) {
      const extraChargePerUnit = Number(addChargeResult[0].amount);
      const parts = Math.ceil(extraWeightInKg / maxWeight); // increment based on slab size
      extraCharge = parts * extraChargePerUnit;
      console.log("Aggregator-specific extra charge:", { parts, extraChargePerUnit, extraCharge });
    } else {
      // fallback if no aggregator-specific charge defined
      const parts = Math.ceil(extraWeightInKg / maxWeight);
      extraCharge = parts * baseRate;
      console.warn("No extra charge mapping found. Fallback to baseRate:", extraCharge);
    }

    const finalRate = baseRate + extraCharge;
    console.log("Final rate for aggregator:", finalRate);

    return { rate: finalRate, maxWeight };
  } catch (err) {
    console.error("Aggregator rate calculation error:", err);
    return { rate: null, maxWeight: null };
  }
}
async function findRateAggrigatorEcom(aggid, originZone, weight,maxWeight) {
  console.log("Finding Rate for Aggregator in Ecom", { aggid, originZone, weight });

  try {
    // Step 1: Get linked courier_id (forwarder)
    const courierMap = await mySqlQury(
      `SELECT courier_id FROM tbl_logistics_partner WHERE id = ?`,
      [aggid]
    );
    if (!courierMap.length) {
      console.error("No forwarder mapped for aggregator:", aggid);
      return { rate: null, maxWeight: null };
    }
    const courierId = courierMap[0].courier_id;

    // Step 2: Use forwarder's logic to find the maxWeight
 

    // Step 3: Get aggregator-specific base rate for zone
    const aggZoneRate = await mySqlQury(
      `SELECT zone_value FROM tbl_ecom_lp_zones_rates 
       WHERE lp_id = ? AND zone_name = ?`,
      [aggid, originZone]
    );
    if (!aggZoneRate.length) {
      console.error("No aggregator zone base rate found.");
      return { rate: null, maxWeight: null };
    }
    const baseRate = Number(aggZoneRate[0].zone_value);
    console.log("Aggregator base rate:", baseRate);

    // Step 4: Calculate extra weight
    const weightInKg = weight / 1000;
    const extraWeightInKg = weightInKg - maxWeight;
    if (extraWeightInKg <= 0) {
      console.log("Within base slab. Final rate = baseRate:", baseRate);
      return { rate: baseRate, maxWeight };
    }

    // Step 5: Fetch aggregator slab-additional charges
    const addChargeResult = await mySqlQury(
      `SELECT amount FROM tbl_ecom_lp_slab_add_charges 
       WHERE lp_id = ? AND zone_name = ?`,
      [aggid, originZone]
    );

    let extraCharge = 0;
    if (addChargeResult.length) {
      const extraChargePerUnit = Number(addChargeResult[0].amount);
      const parts = Math.ceil(extraWeightInKg / maxWeight); // increment based on slab size
      extraCharge = parts * extraChargePerUnit;
      console.log("Aggregator-specific extra charge:", { parts, extraChargePerUnit, extraCharge });
    } else {
      // fallback if no aggregator-specific charge defined
      const parts = Math.ceil(extraWeightInKg / maxWeight);
      extraCharge = parts * baseRate;
      console.warn("No extra charge mapping found. Fallback to baseRate:", extraCharge);
    }

    const finalRate = baseRate + extraCharge;
    console.log("Final rate for aggregator:", finalRate);

    return { rate: finalRate, maxWeight };
  } catch (err) {
    console.error("Aggregator rate calculation error:", err);
    return { rate: null, maxWeight: null };
  }
}

module.exports = {findRateAggrigator, findRateAggrigatorEcom}
const { mySqlQury } = require("../middleware/db");

async function findRateForwarder(forwarderId, originZone, weight) {
  console.log("Finding Rate Forwarder", forwarderId, originZone, weight);

  if (!forwarderId || !originZone || !weight) {
      console.error("Invalid inputs provided! Please check the inputs.");
      return { rate: null, maxWeight: null };
  }

  try {
      const slabResult = await mySqlQury(
          `SELECT slab_id, min_weight, max_weight, unit 
           FROM tbl_exp_weightslabs 
           WHERE courier_id = ? 
           ORDER BY min_weight ASC`,
          [forwarderId]
      );
      console.log("Slab result:", slabResult);

      if (!slabResult || slabResult.length === 0) {
          console.error("No slabs found for the vendor. Please verify the database entries.");
          return { rate: null, maxWeight: null };
      }

      let slabId = null;
      let maxWeight = 0;

      for (const slab of slabResult) {
          if (weight >= slab.min_weight && weight <= slab.max_weight) {
              slabId = slab.slab_id;
              maxWeight = slab.unit.toLowerCase() === 'kg' ? 
                slab.max_weight : slab.max_weight / 1000;
              console.log("Found matching slab:", slab);
              break;
          }
      }

      if (!slabId && weight > slabResult[slabResult.length - 1].max_weight) {
          slabId = slabResult[slabResult.length - 1].slab_id;
          const lastSlab = slabResult[slabResult.length - 1];
          maxWeight = lastSlab.unit.toLowerCase() === 'kg' ? 
            lastSlab.max_weight : lastSlab.max_weight / 1000;
          console.warn(`Weight exceeds range. Using the highest slab ID: ${slabId}`);
      }

      if (!slabId) {
          console.error("No matching slab found for the weight.");
          return { rate: null, maxWeight: null };
      }

      const rateResult = await mySqlQury(
          `SELECT zone_value 
           FROM tbl_exp_zones_rates 
           WHERE courier_id = ? 
             AND zone_name = ? 
             AND weight_slab_id = ?`,
          [forwarderId, originZone, slabId]
      );
      console.log("Rate result:", rateResult);

      if (rateResult.length === 0) {
          console.error(`No rate found for forwarder ${forwarderId}, originZone ${originZone}, slabId ${slabId}`);
          return { rate: null, maxWeight: null };
      }

      const baseRate = rateResult[0].zone_value;
      console.log("Base rate:", baseRate);

      const slab = slabResult.find((s) => s.slab_id === slabId);
      
      // Check if weight is less than slab.max_weight
      // If weight is less than max_weight, use the actual weight for calculations
      // If weight exceeds max_weight, calculate extra weight
      const actualWeight = Math.min(weight, slab.max_weight);
      const extraWeight = weight > slab.max_weight ? weight - slab.max_weight : 0;
      
      console.log("Weight calculation:", { 
        incomingWeight: weight, 
        slabMaxWeight: slab.max_weight,
        actualWeight,
        extraWeight 
      });

      if (extraWeight <= 0) {
          console.log("No extra weight. Returning base rate:", baseRate);
          const maxWeightInKg = slab.unit.toLowerCase() === 'kg' ? 
            slab.max_weight : slab.max_weight / 1000;
          return { rate: Number(baseRate), maxWeight: maxWeightInKg };
      }
      
      // Convert extra weight from grams to kg if needed
      const extraWeightInKg = slab.unit.toLowerCase() === 'kg' ? extraWeight : extraWeight / 1000;
      console.log("Extra weight in kg:", extraWeightInKg);

      const additionalChargesResult = await mySqlQury(
          `SELECT charge_id, weight, unit 
           FROM tbl_exp_slab_additional_charges 
           WHERE courier_id = ? 
             AND weight_slab_id = ? 
           ORDER BY weight ASC`,
          [forwarderId, slabId]
      );
      console.log("Additional charges result:", additionalChargesResult);

      if (!additionalChargesResult || additionalChargesResult.length === 0) {
          console.warn("No additional charges found. Defaulting additional charges to 0.");
          const maxWeightInKg = slab.unit.toLowerCase() === 'kg' ? 
            slab.max_weight : slab.max_weight / 1000;
          return { rate: Number(baseRate), maxWeight: maxWeightInKg };
      }

      let chosenCharge = null;
      for (const charge of additionalChargesResult) {
          if (charge.weight <= extraWeight) {
              chosenCharge = charge;
          }
      }
      console.log("Chosen additional charge in forwarder:", chosenCharge);

      if (!chosenCharge) {
          console.log("No matching additional charge found. Defaulting additional charges to 0 in forwarder");
          const maxWeightInKg = slab.unit.toLowerCase() === 'kg' ? 
            slab.max_weight : slab.max_weight / 1000;
          console.log("in the no matching additional charge found in forwarder", maxWeightInKg, baseRate);
          
          // Calculate parts based on max weight increments
          const incrementSize = maxWeightInKg;
          const parts = Math.ceil(extraWeightInKg / incrementSize);
          console.log("Parts calculated:", parts);
          
          // Calculate additional charge
          const totalAdditionalCharge = parts * Number(baseRate);
          console.log("Total additional charge:", totalAdditionalCharge);
          
          // Calculate final rate
          const finalRate = Number(baseRate) + totalAdditionalCharge;
          console.log("Final rate with additional charges:", finalRate);
          
          return { rate: finalRate, maxWeight: maxWeightInKg };
      }

      const additionalRateResult = await mySqlQury(
          `SELECT amount 
           FROM tbl_exp_slab_additionalamounts 
           WHERE additional_charge_id = ? 
             AND zone_name = ?`,
          [chosenCharge.charge_id, originZone]
      );
      console.log("Additional rate result:", additionalRateResult);

      if (additionalRateResult.length === 0) {
          console.error("No additional amount found for the charge ID and origin.");
          const maxWeightInKg = slab.unit.toLowerCase() === 'kg' ? 
            slab.max_weight : slab.max_weight / 1000;
          return { rate: Number(baseRate), maxWeight: maxWeightInKg };
      }

      const additionalAmount = additionalRateResult[0].amount;
      console.log("Additional amount:", additionalAmount);
      
      const parts = chosenCharge.weight === 0 ? 
        Math.ceil(extraWeightInKg / 1) : 
        Math.ceil(extraWeightInKg / (chosenCharge.unit && chosenCharge.unit.toLowerCase() === 'grams' ? 
          Number(chosenCharge.weight) / 1000 : 
          Number(chosenCharge.weight)));
      
      console.log("Parts calculation:", {extraWeight, chosenCharge, parts});
      const totalAdditionalCharges = parts * additionalAmount;
      console.log("Additional charges calculation:", {additionalAmount, parts, totalAdditionalCharges});

      const totalRate = Number(baseRate) + Number(totalAdditionalCharges);
      console.log("Total rate calculated:", totalRate);

      const maxWeightInKg = slab.unit.toLowerCase() === 'kg' ? 
        slab.max_weight : slab.max_weight / 1000;
      return { rate: Number(totalRate), maxWeight: maxWeightInKg };
  } catch (error) {
      console.error("Error finding rate:", error);
      return { rate: null, maxWeight: null };
  }
}
async function findRateForwarderEcom(forwarderId, originZone, weight) {
  console.log("Finding Rate Forwarder", forwarderId, originZone, weight);

  if (!forwarderId || !originZone || !weight) {
      console.error("Invalid inputs provided! Please check the inputs.");
      return { rate: null, maxWeight: null };
  }

  try {
      const slabResult = await mySqlQury(
          `SELECT slab_id, min_weight, max_weight, unit 
           FROM tbl_ecom_weightslabs 
           WHERE courier_id = ? 
           ORDER BY min_weight ASC`,
          [forwarderId]
      );
      console.log("Slab result:", slabResult);

      if (!slabResult || slabResult.length === 0) {
          console.error("No slabs found for the vendor. Please verify the database entries.");
          return { rate: null, maxWeight: null };
      }

      let slabId = null;
      let maxWeight = 0;

      for (const slab of slabResult) {
          if (weight >= slab.min_weight && weight <= slab.max_weight) {
              slabId = slab.slab_id;
              maxWeight = slab.unit.toLowerCase() === 'kg' ? 
                slab.max_weight : slab.max_weight / 1000;
              console.log("Found matching slab:", slab);
              break;
          }
      }

      if (!slabId && weight > slabResult[slabResult.length - 1].max_weight) {
          slabId = slabResult[slabResult.length - 1].slab_id;
          const lastSlab = slabResult[slabResult.length - 1];
          maxWeight = lastSlab.unit.toLowerCase() === 'kg' ? 
            lastSlab.max_weight : lastSlab.max_weight / 1000;
          console.warn(`Weight exceeds range. Using the highest slab ID: ${slabId}`);
      }

      if (!slabId) {
          console.error("No matching slab found for the weight.");
          return { rate: null, maxWeight: null };
      }

      const rateResult = await mySqlQury(
          `SELECT zone_value 
           FROM tbl_ecom_zones_rates 
           WHERE courier_id = ? 
             AND zone_name = ? 
             AND weight_slab_id = ?`,
          [forwarderId, originZone, slabId]
      );
      console.log("Rate result:", rateResult);

      if (rateResult.length === 0) {
          console.error(`No rate found for forwarder ${forwarderId}, originZone ${originZone}, slabId ${slabId}`);
          return { rate: null, maxWeight: null };
      }

      const baseRate = rateResult[0].zone_value;
      console.log("Base rate:", baseRate);

      const slab = slabResult.find((s) => s.slab_id === slabId);
      
      // Check if weight is less than slab.max_weight
      // If weight is less than max_weight, use the actual weight for calculations
      // If weight exceeds max_weight, calculate extra weight
      const actualWeight = Math.min(weight, slab.max_weight);
      const extraWeight = weight > slab.max_weight ? weight - slab.max_weight : 0;
      
      console.log("Weight calculation:", { 
        incomingWeight: weight, 
        slabMaxWeight: slab.max_weight,
        actualWeight,
        extraWeight 
      });

      if (extraWeight <= 0) {
          console.log("No extra weight. Returning base rate:", baseRate);
          const maxWeightInKg = slab.unit.toLowerCase() === 'kg' ? 
            slab.max_weight : slab.max_weight / 1000;
          return { rate: Number(baseRate), maxWeight: maxWeightInKg };
      }
      
      // Convert extra weight from grams to kg if needed
      const extraWeightInKg = slab.unit.toLowerCase() === 'kg' ? extraWeight : extraWeight / 1000;
      console.log("Extra weight in kg:", extraWeightInKg);

      const additionalChargesResult = await mySqlQury(
          `SELECT charge_id, weight, unit 
           FROM tbl_ecom_slab_additional_charges 
           WHERE courier_id = ? 
             AND weight_slab_id = ? 
           ORDER BY weight ASC`,
          [forwarderId, slabId]
      );
      console.log("Additional charges result:", additionalChargesResult);

      if (!additionalChargesResult || additionalChargesResult.length === 0) {
          console.warn("No additional charges found. Defaulting additional charges to 0.");
          const maxWeightInKg = slab.unit.toLowerCase() === 'kg' ? 
            slab.max_weight : slab.max_weight / 1000;
          return { rate: Number(baseRate), maxWeight: maxWeightInKg };
      }

      let chosenCharge = null;
      for (const charge of additionalChargesResult) {
          if (charge.weight <= extraWeight) {
              chosenCharge = charge;
          }
      }
      console.log("Chosen additional charge in forwarder:", chosenCharge);

      if (!chosenCharge) {
          console.log("No matching additional charge found. Defaulting additional charges to 0 in forwarder");
          const maxWeightInKg = slab.unit.toLowerCase() === 'kg' ? 
            slab.max_weight : slab.max_weight / 1000;
          console.log("in the no matching additional charge found in forwarder", maxWeightInKg, baseRate);
          
          // Calculate parts based on max weight increments
          const incrementSize = maxWeightInKg;
          const parts = Math.ceil(extraWeightInKg / incrementSize);
          console.log("Parts calculated:", parts);
          
          // Calculate additional charge
          const totalAdditionalCharge = parts * Number(baseRate);
          console.log("Total additional charge:", totalAdditionalCharge);
          
          // Calculate final rate
          const finalRate = Number(baseRate) + totalAdditionalCharge;
          console.log("Final rate with additional charges:", finalRate);
          
          return { rate: finalRate, maxWeight: maxWeightInKg };
      }

      const additionalRateResult = await mySqlQury(
          `SELECT amount 
           FROM tbl_ecom_slab_additionalamounts 
           WHERE additional_charge_id = ? 
             AND zone_name = ?`,
          [chosenCharge.charge_id, originZone]
      );
      console.log("Additional rate result:", additionalRateResult);

      if (additionalRateResult.length === 0) {
          console.error("No additional amount found for the charge ID and origin.");
          const maxWeightInKg = slab.unit.toLowerCase() === 'kg' ? 
            slab.max_weight : slab.max_weight / 1000;
          return { rate: Number(baseRate), maxWeight: maxWeightInKg };
      }

      const additionalAmount = additionalRateResult[0].amount;
      console.log("Additional amount:", additionalAmount);
      
      const parts = chosenCharge.weight === 0 ? 
        Math.ceil(extraWeightInKg / 1) : 
        Math.ceil(extraWeightInKg / (chosenCharge.unit && chosenCharge.unit.toLowerCase() === 'grams' ? 
          Number(chosenCharge.weight) / 1000 : 
          Number(chosenCharge.weight)));
      
      console.log("Parts calculation:", {extraWeight, chosenCharge, parts});
      const totalAdditionalCharges = parts * additionalAmount;
      console.log("Additional charges calculation:", {additionalAmount, parts, totalAdditionalCharges});

      const totalRate = Number(baseRate) + Number(totalAdditionalCharges);
      console.log("Total rate calculated:", totalRate);

      const maxWeightInKg = slab.unit.toLowerCase() === 'kg' ? 
        slab.max_weight : slab.max_weight / 1000;
      return { rate: Number(totalRate), maxWeight: maxWeightInKg };
  } catch (error) {
      console.error("Error finding rate:", error);
      return { rate: null, maxWeight: null };
  }
}

module.exports = {findRateForwarder, findRateForwarderEcom}
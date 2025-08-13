const { mySqlQury } = require("../middleware/db");
const calculateChargeValueForwarder = require("./calculateChargeValueForwarder");
const calculateAdditionalChargesForwarder = async (
  clientId,
  total_weight,
  total_boxes,
  paymentType,
  clientBaseRate,
  clientBaseValue,
  invoice,
  cod
) => {
  const additionalChargesQuery = `SELECT * FROM tbl_courier_exp_additional_charges WHERE courier_id = ? `;
  const additionalChargesResult = await mySqlQury(additionalChargesQuery, [clientId]);
  console.log("additionalChargesResult in LTL forwarder", additionalChargesResult);

  let additionalCharge = 0;
  let chargesBreakdown = [];

  if (additionalChargesResult.length > 0) {
    for (const charge of additionalChargesResult) {
      const {
        charge_name,
        calculation_based_on_min,
        calculation_based_on_max,
        condition_based,
        min_value,
        max_value,
        chargable_value_type
      } = charge;

      let chargeValue = 0;

      if (condition_based === "or") {
        const minValue = calculateChargeValueForwarder(
          calculation_based_on_min,
          min_value,
          total_weight,
          total_boxes,
          clientBaseValue,
          invoice,
          cod
        );
        const maxValue = calculateChargeValueForwarder(
          calculation_based_on_max,
          max_value,
          total_weight,
          total_boxes,
          clientBaseValue,
          invoice,
          cod
        );

        chargeValue = chargable_value_type === "higher"
          ? Math.max(minValue, maxValue)
          : Math.min(minValue, maxValue);

      } else if (condition_based === "and") {
        const minValue = calculateChargeValueForwarder(
          calculation_based_on_min,
          min_value,
          total_weight,
          total_boxes,
          clientBaseValue,
          invoice,
          cod
        );

        const maxValue = calculateChargeValueForwarder(
          calculation_based_on_max,
          max_value,
          total_weight,
          total_boxes,
          clientBaseValue,
          invoice,
          cod
        );

        chargeValue = minValue + maxValue;
      }

      if (chargeValue > 0) {
        additionalCharge += chargeValue;
        chargesBreakdown.push({
          charge_name,
          value: Number(chargeValue.toFixed(2))
        });
      }
    }
  }

  return {
    totalCharge: Number(additionalCharge.toFixed(2)),
    ...(chargesBreakdown.length > 0 && { chargesBreakdown })
  };
};

const calculateAdditionalChargesForwarderEcom = async (
  clientId,
  total_weight,
  total_boxes,
  paymentType,
  clientBaseRate,
  clientBaseValue,
  invoice,
  cod
) => {
  const additionalChargesQuery = `SELECT * FROM tbl_courier_ecom_additional_charges WHERE courier_id = ? `;
  const additionalChargesResult = await mySqlQury(additionalChargesQuery, [clientId]);
  console.log("additionalChargesResult in ecom forwarder", additionalChargesResult);

  let additionalCharge = 0;
  let chargesBreakdown = [];

  if (additionalChargesResult.length > 0) {
    for (const charge of additionalChargesResult) {
      const {
        charge_name,
        calculation_based_on_min,
        calculation_based_on_max,
        condition_based,
        min_value,
        max_value,
        chargable_value_type
      } = charge;

      let chargeValue = 0;

      if (condition_based === "or") {
        const minValue = calculateChargeValueForwarder(
          calculation_based_on_min,
          min_value,
          total_weight,
          total_boxes,
          clientBaseValue,
          invoice,
          cod
        );

        const maxValue = calculateChargeValueForwarder(
          calculation_based_on_max,
          max_value,
          total_weight,
          total_boxes,
          clientBaseValue,
          invoice,
          cod
        );

        chargeValue = chargable_value_type === "higher"
          ? Math.max(minValue, maxValue)
          : Math.min(minValue, maxValue);

      } else if (condition_based === "and") {
        const minValue = calculateChargeValueForwarder(
          calculation_based_on_min,
          min_value,
          total_weight,
          total_boxes,
          clientBaseValue,
          invoice,
          cod
        );

        const maxValue = calculateChargeValueForwarder(
          calculation_based_on_max,
          max_value,
          total_weight,
          total_boxes,
          clientBaseValue,
          invoice,
          cod
        );

        chargeValue = minValue + maxValue;
      }

      if (chargeValue > 0) {
        additionalCharge += chargeValue;
        chargesBreakdown.push({
          charge_name,
          value: Number(chargeValue.toFixed(2))
        });
      }
    }
  }

  return {
    totalCharge: Number(additionalCharge.toFixed(2)),
    ...(chargesBreakdown.length > 0 && { chargesBreakdown })
  };
};
module.exports = {calculateAdditionalChargesForwarder, calculateAdditionalChargesForwarderEcom}
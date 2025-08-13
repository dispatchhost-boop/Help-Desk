const { mySqlQury } = require("../middleware/db");
const calculateChargeValue = require("./calculateChargeValue");

const calculateAdditionalCharges = async (
  clientId,
  total_weight,
  total_boxes,
  paymentType,
  clientBaseRate,
  clientBaseValue,
  invoice,
  cod
) => {
  const additionalChargesQuery = `SELECT * FROM  tbl_exp_lp_additional_charges WHERE lp_id = ? AND charge_name != 'oda_charge'`;
  const additionalChargesResult = await mySqlQury(additionalChargesQuery, [clientId]);
  console.log("additionalChargesResult in the calculateAdditionalCharges in ltl ", additionalChargesResult);

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
      if (paymentType === 'prepaid' && charge_name.toLowerCase().includes('cod')) {
        continue;
      }

      let chargeValue = 0;
      if (condition_based === 'or') {
        console.log("in the or", calculation_based_on_min, min_value, total_weight, total_boxes, clientBaseValue, invoice, cod);
        const minValue = calculateChargeValue(
          calculation_based_on_min,
          min_value,
          total_weight,
          total_boxes,
          clientBaseValue,
          invoice,
          cod,
          paymentType
        );

        const maxValue = calculateChargeValue(
          calculation_based_on_max,
          max_value,
          total_weight,
          total_boxes,
          clientBaseValue,
          invoice,
          cod,
          paymentType
        );

        chargeValue = chargable_value_type === 'higher'
          ? Math.max(minValue, maxValue)
          : Math.min(minValue, maxValue);

      } else if (condition_based === 'and') {
        console.log("in the and", calculation_based_on_min, min_value, total_weight, total_boxes, clientBaseValue, invoice, cod);
        const minValue = calculateChargeValue(
          calculation_based_on_min,
          min_value,
          total_weight,
          total_boxes,
          clientBaseValue,
          invoice,
          cod,
          paymentType
        );

        const maxValue = calculateChargeValue(
          calculation_based_on_max,
          max_value,
          total_weight,
          total_boxes,
          clientBaseValue,
          invoice,
          cod,
          paymentType
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
module.exports = calculateAdditionalCharges
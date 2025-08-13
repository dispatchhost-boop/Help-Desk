const calculateChargeValueForwarder = (
  calculationType,
  value,
  total_weight,
  total_boxes,
  clientBaseValue,
  invoice,
  cod
) => {
  if (!calculationType || !value) return 0;
  const validatedValue = Number(value) || 0;
  if (validatedValue === 0) return 0;
  console.log("validatedValue in forwarder",calculationType, validatedValue);
  console.log("cod value", cod);
  console.log("cod value type", typeof cod);
  console.log("type of updated with number co type", typeof Number(cod));

  switch (calculationType) {
    case 'invoice_value':
      console.log("invoice value in forwarder", (Number(invoice) * validatedValue) / 100);
      return (Number(invoice) * validatedValue) / 100;
    case 'lr':
      console.log("lr value in forwarder", validatedValue);
      return validatedValue;
    case 'kg':
      console.log("kg value in forwarder", total_weight * validatedValue);
      return total_weight * validatedValue;
    case 'boxes':
      console.log("boxes value in forwarder", total_boxes * validatedValue);
      return total_boxes * validatedValue;
    case 'fs':
      console.log("fs value in forwarder", (clientBaseValue * validatedValue) / 100);
      return(clientBaseValue * validatedValue) / 100;
    case 'base_value':
      console.log("base value in forwarder", (clientBaseValue * validatedValue) / 100);
      return (clientBaseValue * validatedValue) / 100;
    case 'cod':
      console.log("cod value in forwarder", validatedValue )
      return validatedValue
    default:
      return 0;
  }
};

module.exports = calculateChargeValueForwarder
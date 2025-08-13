// Helper function to calculate charge value based on conditions
function calculateChargeValue(calculationType, value, total_weight, total_boxes, clientBaseValue, invoice, cod, paymentType) {

  // Input validation
  if (!calculationType || value === null || value === undefined) {
    console.error("Invalid inputs provided!");
    return 0;
  }

  console.log("calculationType", calculationType, value, total_weight, total_boxes, clientBaseValue, invoice, cod, paymentType);

  const validatedValue = Number(value) || 0;

  switch (calculationType) {
    case 'invoice_value':
      console.log("in the invoice_value", Number(invoice) * validatedValue)
      return (Number(invoice) * validatedValue) / 100;

    case 'lr':
      console.log("in the lr", 1 * validatedValue)
      return 1 * validatedValue;

    case 'kg':
      console.log("in the kg", total_weight * validatedValue)
      return total_weight * validatedValue;

    case 'boxes':
      console.log("in the boxes", total_boxes * validatedValue)
      return total_boxes * validatedValue;

    case 'base_value':
      console.log("in the base_value", (clientBaseValue * validatedValue) / 100)
      return (clientBaseValue * validatedValue) / 100;

    case 'cod':
      console.log("in the cod", cod * validatedValue)
      if (paymentType?.toLowerCase() === 'cod') {
        console.log("in the cod", validatedValue)
        return validatedValue;
      } else {
        console.log("Skipping cod charge as paymentType is not COD");
        return 0;
      }

    default:
      console.warn("Unknown calculation type:", calculationType);
      return 0;
  }
}

module.exports = calculateChargeValue
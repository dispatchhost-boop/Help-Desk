// utils/validators.js
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Adjust for your country as needed:
const PHONE_RE = /^[0-9]{6,15}$/;
// For India use: const PIN_RE = /^[1-9][0-9]{5}$/;
const PIN_RE   = /^[0-9]{4,10}$/;
const PAYMENT_ENUM = new Set(['prepaid','postpaid','cod']);

function pushIssue(arr, field, msg, level='error') {
  arr.push({ field, message: msg, level }); // level: error | warn
}

function validateBoxes(boxes = []) {
  const issues = [];
  boxes.forEach((b, i) => {
    const idx = i+1;
    const any =
      (b.packageType && String(b.packageType).trim()) ||
      Number(b.length) || Number(b.breadth) || Number(b.height) ||
      (b.dimensionUnit && String(b.dimensionUnit).trim()) ||
      Number(b.weight) || (b.weightUnit && String(b.weightUnit).trim());
    if (!any) return; // empty row is fine

    if (b.length < 0 || b.breadth < 0 || b.height < 0)
      pushIssue(issues, `boxes[${i}]`, `Box ${idx} dimensions cannot be negative`);
    if (b.weight < 0) pushIssue(issues, `boxes[${i}]`, `Box ${idx} weight cannot be negative`);
    if (!b.dimensionUnit) pushIssue(issues, `boxes[${i}].dimensionUnit`, `Box ${idx} dimensionUnit required`, 'warn');
    if (!b.weightUnit) pushIssue(issues, `boxes[${i}].weightUnit`, `Box ${idx} weightUnit required`, 'warn');
  });
  return issues;
}

function validateProducts(products = []) {
  const issues = [];
  if (!products.length) {
    pushIssue(issues, 'productsDetails', 'At least one product is required');
    return { issues, qtySum: 0 };
  }
  let qtySum = 0;
  products.forEach((p, i) => {
    const idx = i+1;
    if (!p.name) pushIssue(issues, `products[${i}].name`, `Product ${idx}: name is required`);
    if (!p.sku) pushIssue(issues, `products[${i}].sku`, `Product ${idx}: SKU is required`);
    if (p.price == null || Number(p.price) < 0)
      pushIssue(issues, `products[${i}].price`, `Product ${idx}: price must be >= 0`);
    if (!Number.isFinite(Number(p.quantity)) || Number(p.quantity) <= 0)
      pushIssue(issues, `products[${i}].quantity`, `Product ${idx}: quantity must be > 0`);
    qtySum += Number(p.quantity || 0);
  });
  return { issues, qtySum };
}

/**
 * Validate payload (same shape used by your single-order route)
 * Returns: { valid, message, issues[] }
 */
function validateExpressCreateOrderData(payload) {
  const issues = [];

  // Order basics
  if (!payload.orderID) pushIssue(issues, 'orderID', 'orderID is required');
  if (!PAYMENT_ENUM.has(String(payload.paymentMode || '').toLowerCase()))
    pushIssue(issues, 'paymentMode', 'paymentMode must be one of prepaid|postpaid|cod');

  if (String(payload.paymentMode).toLowerCase() === 'cod') {
    if (payload.collectableAmount == null || Number(payload.collectableAmount) <= 0)
      pushIssue(issues, 'collectableAmount', 'collectableAmount must be > 0 for COD');
  } else {
    if (Number(payload.collectableAmount || 0) !== 0)
      pushIssue(issues, 'collectableAmount', 'collectableAmount should be 0 when paymentMode is not COD', 'warn');
  }

  if (payload.total_Weight == null || Number(payload.total_Weight) <= 0)
    pushIssue(issues, 'total_Weight', 'total_Weight (kg) must be > 0');

  if (payload.totalQty == null || Number(payload.totalQty) <= 0)
    pushIssue(issues, 'totalQty', 'totalQty must be > 0');

  if (payload.warehouseID == null || payload.warehouseID === '')
    pushIssue(issues, 'warehouseID', 'warehouseID is required');

  // Consignee
  const c = payload.consigneeDetails || {};
  if (!c.firstName) pushIssue(issues, 'consignee.firstName', 'Consignee firstName is required');
  if (!c.lastName) pushIssue(issues, 'consignee.lastName', 'Consignee lastName is required');
  if (!c.phone || !PHONE_RE.test(String(c.phone)))
    pushIssue(issues, 'consignee.phone', 'Valid consignee phone is required');
  if (c.email && !EMAIL_RE.test(String(c.email)))
    pushIssue(issues, 'consignee.email', 'Consignee email format invalid', 'warn');
  ['addressLine1','country','state','city'].forEach(f => {
    if (!c[f]) pushIssue(issues, `consignee.${f}`, `Consignee ${f} is required`);
  });
  if (!c.pincode || !PIN_RE.test(String(c.pincode)))
    pushIssue(issues, 'consignee.pincode', 'Valid consignee pincode is required');

  // Billing
  const same = !!c.billingSameAsShipping;
  if (!same) {
    const b = payload.billingDetails || {};
    ['billing_first_name','billing_last_name','billing_phone','billing_address_line1',
     'billing_country','billing_state','billing_city','billing_pincode'].forEach(f => {
      if (!b[f]) pushIssue(issues, `billing.${f}`, `${f} is required when billingSameAsShipping=0`);
    });
    if (b.billing_email && !EMAIL_RE.test(String(b.billing_email)))
      pushIssue(issues, 'billing.billing_email', 'Billing email format invalid', 'warn');
    if (b.billing_phone && !PHONE_RE.test(String(b.billing_phone)))
      pushIssue(issues, 'billing.billing_phone', 'Billing phone format invalid');
    if (b.billing_pincode && !PIN_RE.test(String(b.billing_pincode)))
      pushIssue(issues, 'billing.billing_pincode', 'Billing pincode format invalid');
  }

  // Products
  const { issues: productIssues, qtySum } = validateProducts(payload.productsDetails || []);
  issues.push(...productIssues);

  // Totals sanity (warnings)
  if (Number(payload.totalQty || 0) !== qtySum)
    pushIssue(issues, 'totalQty', `totalQty (${payload.totalQty}) != sum(product.quantity) (${qtySum})`, 'warn');

  // Boxes
  issues.push(...validateBoxes(payload.boxes || []));

  const hasErrors = issues.some(x => x.level === 'error');
  return {
    valid: !hasErrors,
    message: hasErrors ? 'Validation failed' : 'OK',
    issues
  };
}

module.exports = { validateExpressCreateOrderData };

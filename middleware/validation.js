// middleware/validation.js

function validateExpressCreateOrderData(data) {
  // 1. Top-level fields
 
  if (!data.refid || data.refid.trim() === "") {
    return { valid: false, message: "Please enter ref number." };
  }
  if (!data.refid || data.refid.trim() === "") {
    return { valid: false, message: "Please enter Order ID." };
  }
  if (!data.paymentMode || data.paymentMode.trim() === "") {
    return { valid: false, message: "Please select payment mode." };
  }
  if (!data.warehouseID) {
    return { valid: false, message: "Please select pickup location." };
  }

  // 2. Consignee details
  const c = data.consigneeDetails || {};
  if (!c.firstName || c.firstName.trim() === "") {
    return { valid: false, message: "Please enter customer first name." };
  }
  
  if (!c.email || c.email.trim() === "") {
    return { valid: false, message: "Please enter customer email." };
  }
  if (!c.phone || c.phone.trim() === "") {
    return { valid: false, message: "Please enter customer phone number." };
  }
  let phone = c.phone.trim();
  if (phone.startsWith("+")) {
    phone = phone.substring(1);
  }
  // Remove any non-digit characters (optional, in case formatting is present)
  phone = phone.replace(/\D/g, "");
  if (phone.length !== 10) {
    return { valid: false, message: "Customer phone number must be 10 digits." };
  }
  if (!c.addressLine1 || c.addressLine1.trim() === "") {
    return { valid: false, message: "Please enter shipping address line 1." };
  }
  // if (!c.landmark || c.landmark.trim() === "") {
  //   return { valid: false, message: "Please enter nearby landmark." };
  // }
  if (!c.country || c.country.trim() === "") {
    return { valid: false, message: "Please select country." };
  }
  if (!c.pincode || c.pincode.trim() === "") {
    return { valid: false, message: "Please enter pincode." };
  }
  if (!c.state || c.state.trim() === "") {
    return { valid: false, message: "Please enter state." };
  }
  if (!c.city || c.city.trim() === "") {
    return { valid: false, message: "Please enter city." };
  }

  // 3. Boxes
  if (!Array.isArray(data.boxes) || data.boxes.length === 0) {
    return { valid: false, message: "Please fill box details." };
  }
  // Check each box for required fields
  for (const [i, box] of data.boxes.entries()) {
    if (
      !box.packageType || box.packageType.trim() === "" ||
      !box.length || box.length === "" ||
      !box.breadth || box.breadth === "" ||
      !box.height || box.height === "" ||
      !box.dimensionUnit || box.dimensionUnit.trim() === "" ||
      !box.weight || box.weight === "" ||
      !box.weightUnit || box.weightUnit.trim() === ""
    ) {
      return { valid: false, message: `Please fill all box details for box #${i + 1}.` };
    }
  }

  // 4. Products
  if (!Array.isArray(data.productsDetails) || data.productsDetails.length === 0) {
    return { valid: false, message: "Please fill product details." };
  }

  // 5. Optionally, check each product for required fields
  for (const [i, p] of (data.productsDetails || []).entries()) {
    if (!p.name || !p.sku || !p.category || !p.price) {
      return { valid: false, message: `Please fill all fields for product #${i + 1}.` };
    }
  }

  // All checks passed
  return { valid: true };
}


function validateCustomerDetails(consigneeDetails, orderid, formData) {
  console.log("consigneeDetails",consigneeDetails)
  const errors = {};
  
  // Validate consignee details exist
  if (!consigneeDetails) {
    errors.consigneeDetails = "Consignee details are required";
    return errors;
  }

  const { name, email, phone, pincode, city, nearby, address, state } = consigneeDetails;
  
  // Name validation
  if (!name || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long";
  }

  // Address validation
  if (!address || address.trim().length < 4) {
    errors.address = "Address must be at least 4 characters long";
  }

  // Email validation
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // if (!email || !emailRegex.test(email)) {
  //   errors.email = "Please enter a valid email address";
  // }

  // Phone validation (10 digits)
  const phoneRegex = /^[0-9]{10}$/;
  if (!phone || !phoneRegex.test(phone)) {
    errors.phone = "Phone number must be a 10-digit number";
  }

  // Pincode validation (6 digits)
  const pincodeRegex = /^[0-9]{6}$/;
  if (!pincode || !pincodeRegex.test(pincode)) {
    errors.pincode = "Pincode must be a 6-digit number";
  }

  // City validation
  if (!city || city.trim().length < 2) {
    errors.city = "City name must be at least 2 characters long";
  }

  // State validation
  if (!state || state.trim().length < 2) {
    errors.state = "State name must be at least 2 characters long";
  }

  // Nearby validation (optional)
  if (nearby && nearby.trim().length < 2) {
    errors.nearby = "Nearby must be at least 2 characters long if provided";
  }

  // Order ID validation
  if (!orderid) {
    errors.orderid = "Order ID is required";
  }

  // Validate form data if provided
  if (formData) {
    // Order Date validation
    if (!formData.orderDate) {
      errors.orderDate = "Order date is required";
    } else {
      const orderDateObj = new Date(formData.orderDate);
      if (isNaN(orderDateObj.getTime())) {
        errors.orderDate = "Invalid order date format";
      } else {
        // Optional: Check if date is not in future
        const today = new Date();
        if (orderDateObj > today) {
          errors.orderDate = "Order date cannot be in the future";
        }
      }
    }

    // PO Order validation
    if (!formData.poOrder) {
      errors.poOrder = "Purchase Order number is required";
    }

    // Invoice Amount validation
    if (!formData.invoiceAmount || isNaN(formData.invoiceAmount)) {
      errors.invoiceAmount = "Valid invoice amount is required";
    } else if (formData.invoiceAmount <= 0) {
      errors.invoiceAmount = "Invoice amount must be greater than 0";
    }

    // Invoice Number validation
    if (!formData.InvoiceNo) {
      errors.InvoiceNo = "Invoice number is required";
    } else if (typeof formData.InvoiceNo !== 'string' || formData.InvoiceNo.trim().length < 1) {
      errors.InvoiceNo = "Valid invoice number is required";
    }

    // Products validation
    if (!formData.products || !Array.isArray(formData.products) || formData.products.length === 0) {
      errors.products = "At least one product is required";
    } else {
      // Validate each product
      formData.products.forEach((product, index) => {
        if (!product.productName || !product.quantity || !product.orderValue) {
          errors[`product_${index}`] = "Product name, quantity, and order value are required";
        }
        // Additional validation for numeric values
        if (isNaN(product.quantity) || product.quantity <= 0) {
          errors[`product_${index}_quantity`] = "Product quantity must be a positive number";
        }
        if (isNaN(product.orderValue) || product.orderValue <= 0) {
          errors[`product_${index}_value`] = "Product order value must be a positive number";
        }
      });
    }

    // Boxes validation
    if (!formData.boxes || !Array.isArray(formData.boxes) || formData.boxes.length === 0) {
      errors.boxes = "At least one box dimension is required";
    } else {
      // Validate each box
      formData.boxes.forEach((box, index) => {
        if (!box.length || !box.breadth || !box.height || !box.quantity) {
          errors[`box_${index}`] = "Box dimensions and quantity are required";
        }
        // Additional validation for numeric values
        const dimensions = ['length', 'breadth', 'height', 'quantity'];
        dimensions.forEach(dim => {
          if (isNaN(box[dim]) || box[dim] <= 0) {
            errors[`box_${index}_${dim}`] = `Box ${dim} must be a positive number`;
          }
        });
      });
    }

    // Weight validation
    if (!formData.totalWeight || isNaN(formData.totalWeight) || formData.totalWeight <= 0) {
      errors.totalWeight = "Valid total weight is required";
    }

    // Total boxes validation
    if (!formData.totalBoxes || isNaN(formData.totalBoxes) || formData.totalBoxes <= 0) {
      errors.totalBoxes = "Valid total boxes count is required";
    }

    // Validate total boxes matches sum of box quantities
    if (formData.boxes && Array.isArray(formData.boxes)) {
      const totalBoxQuantity = formData.boxes.reduce((sum, box) => sum + (Number(box.quantity) || 0), 0);
      if (totalBoxQuantity !== Number(formData.totalBoxes)) {
        errors.totalBoxesMatch = "Total boxes count does not match sum of box quantities";
      }
    }
  }

  return errors;
}

function validateMultiOrderData(orderData) {
  const errors = {};

  // Validate required fields in the main order data
  if (!orderData.orderid) errors.orderid = 'Order ID is required';
  if (!orderData.orderDate) {
    errors.orderDate = 'Order date is required';
  } else {
    const orderDateObj = new Date(orderData.orderDate);
    if (isNaN(orderDateObj.getTime())) {
      errors.orderDate = 'Invalid order date format';
    } else {
      const today = new Date();
      if (orderDateObj > today) {
        errors.orderDate = 'Order date cannot be in the future';
      }
    }
  }
  if (!orderData.clientID) errors.clientID = 'Client ID is required';
  
  // Validate arrays
  if (!Array.isArray(orderData.poData) || orderData.poData.length === 0) {
    errors.poData = 'At least one PO is required';
  }
 

  // Validate consignee details and format errors clearly
  const consigneeValidation = validateCustomerDetails(orderData.consigneeDetails, orderData.orderid);
  if (Object.keys(consigneeValidation).length > 0) {
    errors.consigneeDetails = consigneeValidation;
  }
  console.log("below the validatecutomerdetails",consigneeValidation)

  // Validate each PO in poData
  if (Array.isArray(orderData.poData)) {
    orderData.poData.forEach((po, index) => {
      const poErrors = {};

      // Basic PO validation
      if (!po.wpid) poErrors.wpid = 'PO number is required';
      if (!po.paymentType) {
        poErrors.paymentType = 'Payment type is required';
      } else if (!['cod', 'prepaid', 'check-on-delivery'].includes(po.paymentType)) {
        poErrors.paymentType = 'Invalid payment type';
      }
      
      // Numeric validations
      if (!po.totalBoxes || isNaN(po.totalBoxes) || po.totalBoxes <= 0) {
        poErrors.totalBoxes = 'Total boxes must be a positive number';
      }
      if (!po.warehouseId || isNaN(po.warehouseId) || po.warehouseId <= 0) {
        poErrors.warehouseId = 'Warehouse ID is required';
      }
      if (!po.totalWeight || isNaN(po.totalWeight) || po.totalWeight <= 0) {
        poErrors.totalWeight = 'Total weight must be a positive number';
      }
      if (!po.weightUnit) poErrors.weightUnit = 'Weight unit is required';
      if (!po.InvoiceAmount || isNaN(po.InvoiceAmount) || po.InvoiceAmount <= 0) {
        poErrors.InvoiceAmount = 'Invoice amount must be a positive number';
      }
      if (!po.InvoiceNo) poErrors.InvoiceNo = 'Invoice number is required';

      // Validate payment details based on payment type
      if (po.paymentType === 'cod') {
        if (!po.additionalData?.amountCash || isNaN(po.additionalData.amountCash) || po.additionalData.amountCash <= 0) {
          poErrors.amountCash = 'Valid cash amount is required for COD';
        }
      } else if (po.paymentType === 'check-on-delivery') {
        if (!po.additionalData?.checkFavourOf) {
          poErrors.checkFavourOf = 'Check favour of is required';
        }
        if (!po.additionalData?.checkAmount || isNaN(po.additionalData.checkAmount) || po.additionalData.checkAmount <= 0) {
          poErrors.checkAmount = 'Valid check amount is required';
        }
      }

      // Validate products
      if (!Array.isArray(po.products) || po.products.length === 0) {
        poErrors.products = 'At least one product is required';
      } else {
        po.products.forEach((product, productIndex) => {
          const productErrors = {};
          if (!product.product_name) productErrors.name = 'Product name is required';
          if (!product.quantity || isNaN(product.quantity) || product.quantity <= 0) {
            productErrors.quantity = 'Valid product quantity is required';
          }
          if (!product.order_value || isNaN(product.order_value) || product.order_value <= 0) {
            productErrors.value = 'Valid product value is required';
          }
          if (!product.category) productErrors.category = 'Product category is required';
          if (!product.hsn_id) productErrors.hsn = 'Product HSN code is required';

          if (Object.keys(productErrors).length > 0) {
            poErrors[`product_${productIndex}`] = productErrors;
          }
        });
      }

      // Validate boxes
      if (!Array.isArray(po.boxes) || po.boxes.length === 0) {
        poErrors.boxes = 'At least one box dimension is required';
      } else {
        let totalBoxQuantity = 0;
        po.boxes.forEach((box, boxIndex) => {
          const boxErrors = {};
          if (!box.boxQuantity || isNaN(box.boxQuantity) || box.boxQuantity <= 0) {
            boxErrors.quantity = 'Valid box quantity is required';
          } else {
            totalBoxQuantity += parseInt(box.boxQuantity);
          }
          if (!box.length || isNaN(box.length) || box.length <= 0) boxErrors.length = 'Valid length is required';
          if (!box.breadth || isNaN(box.breadth) || box.breadth <= 0) boxErrors.breadth = 'Valid breadth is required';
          if (!box.height || isNaN(box.height) || box.height <= 0) boxErrors.height = 'Valid height is required';

          if (Object.keys(boxErrors).length > 0) {
            poErrors[`box_${boxIndex}`] = boxErrors;
          }
        });

        // Validate total boxes matches sum of box quantities
        if (totalBoxQuantity !== parseInt(po.totalBoxes)) {
          poErrors.boxQuantityMismatch = 'Total boxes does not match sum of box quantities';
        }
      }

      if (Object.keys(poErrors).length > 0) {
        errors[`po_${index}`] = poErrors;
      }
    });
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

function validateWarehouseData(warehouseData) {
  const errors = {};

  // Validate basic warehouse details
  if (!warehouseData.warehouseName?.trim()) {
    errors.warehouseName = 'Warehouse name is required';
  }

  // Validate pincode (6 digits)
  const pincodeRegex = /^[0-9]{6}$/;
  if (!warehouseData.pincode || !pincodeRegex.test(warehouseData.pincode)) {
    errors.pincode = 'Pincode must be a 6-digit number';
  }

  // Validate city
  if (!warehouseData.city?.trim()) {
    errors.city = 'City is required';
  }

  // Validate state
  if (!warehouseData.state?.trim()) {
    errors.state = 'State is required';
  }

  // Validate address
  if (!warehouseData.address?.trim()) {
    errors.address = 'Address is required';
  } else if (warehouseData.address.trim().length < 5) {
    errors.address = 'Address must be at least 5 characters long';
  }

  // Validate contact person details
  if (!warehouseData.contactPersonName?.trim()) {
    errors.contactPersonName = 'Contact person name is required';
  }

  // Validate phone (10 digits)
  const phoneRegex = /^[0-9]{10}$/;
  if (!warehouseData.phoneWarehouse || !phoneRegex.test(warehouseData.phoneWarehouse)) {
    errors.phoneWarehouse = 'Phone number must be a 10-digit number';
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!warehouseData.emailWarehouse || !emailRegex.test(warehouseData.emailWarehouse)) {
    errors.emailWarehouse = 'Please enter a valid email address';
  }

  // Validate time format if provided
  

  // Validate working days
  if (!Array.isArray(warehouseData.workingDays) || warehouseData.workingDays.length === 0) {
    errors.workingDays = 'At least one working day must be selected';
  } else {
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const invalidDays = warehouseData.workingDays.filter(day => !validDays.includes(day));
    if (invalidDays.length > 0) {
      errors.workingDays = `Invalid working days: ${invalidDays.join(', ')}`;
    }
  }

  // Validate client selection
  // if (!warehouseData.clientSelection) {
  //   errors.clientSelection = 'Client selection is required';
  // }

  // Validate slot if required
  if (warehouseData.slot === undefined || warehouseData.slot === '') {
    errors.slot = 'Preferred slot is required';
  }

  // Validate return details if provided
  if (warehouseData.returnDetails) {
    const returnErrors = {};

    if (warehouseData.returnDetails.address?.trim()) {
      // If return address is provided, validate all return fields
      if (!warehouseData.returnDetails.pincode || !pincodeRegex.test(warehouseData.returnDetails.pincode)) {
        returnErrors.pincode = 'Return pincode must be a 6-digit number';
      }
      if (!warehouseData.returnDetails.city?.trim()) {
        returnErrors.city = 'Return city is required';
      }
      if (!warehouseData.returnDetails.state?.trim()) {
        returnErrors.state = 'Return state is required';
      }
      if (warehouseData.returnDetails.address.trim().length < 5) {
        returnErrors.address = 'Return address must be at least 5 characters long';
      }
    }

    if (Object.keys(returnErrors).length > 0) {
      errors.returnDetails = {
        title: "Return Address Validation Errors",
        errors: Object.entries(returnErrors).map(([field, message]) => ({
          field: field,
          message: message
        }))
      };
    }
  }

  // Format all errors in a consistent structure
  if (Object.keys(errors).length > 0) {
    return {
      title: "Warehouse Validation Errors",
      errors: Object.entries(errors).map(([field, message]) => {
        // Special handling for returnDetails which already has the desired structure
        if (field === 'returnDetails') {
          return {
            field: 'returnDetails',
            details: message
          };
        }
        return {
          field: field,
          message: message
        };
      })
    };
  }

  return null;
}

function validateForwarderForm1(form1Data, files, volumetric) {
  const errors = {};

  // File validation
  if (!files || files.length === 0) {
    errors.logo = 'Company logo is required';
  } else {
    const file = files[0];
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      errors.logo = 'Only JPG, JPEG, and PNG files are allowed';
    }
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.logo = 'File size should not exceed 5MB';
    }
  }

  // Basic field validations
  if (!form1Data.forwarderName?.trim()) {
    errors.forwarderName = 'Forwarder name is required';
  }

  if (!form1Data.forwarderType?.trim()) {
    errors.forwarderType = 'forwarder is required';
  }

  if (!form1Data.companyName?.trim()) {
    errors.companyName = 'Company name is required';
  }

  // Address validations
  if (!form1Data.companyAddress?.trim()) {
    errors.companyAddress = 'Company address is required';
  }

  if (!form1Data.companyCountry?.trim()) {
    errors.companyCountry = 'Country is required';
  }

  if (!form1Data.companyState?.trim()) {
    errors.companyState = 'State is required';
  }

  if (!form1Data.companyDistrict?.trim()) {
    errors.companyDistrict = 'District is required';
  }

  // Date validations
  if (!form1Data.fromDate) {
    errors.fromDate = 'From date is required';
  }

  if (!form1Data.fromTo) {
    errors.fromTo = 'To date is required';
  }

  // Shipment type validation
  if (!form1Data.shipmentType?.trim()) {
    errors.shipmentType = 'Shipment type is required';
  }

  // Product type validation
  if (!form1Data.ProductType?.trim()) {
    errors.ProductType = 'Product type is required';
  }

  // API selection validation
  if (!form1Data.chooseAPi?.trim()) {
    errors.chooseAPi = 'API selection is required';
  }

  // Volumetric validation
  if (!volumetric || isNaN(volumetric) || volumetric <= 0) {
    errors.volumetric = 'Valid volumetric value is required';
  }

  // Format all errors in a consistent structure
  if (Object.keys(errors).length > 0) {
    return {
      title: "Forwarder Form 1 Validation Errors",
      errors: Object.entries(errors).map(([field, message]) => ({
        field,
        message
      }))
    };
  }

  return null;
}

function validateAggregatorForm1(form1Data, files) {
  const errors = {};

  // File validation
  if (!files || files.length === 0) {
    errors.logo = 'Company logo is required';
  } else {
    const file = files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      errors.logo = 'Only JPG, JPEG, and PNG files are allowed';
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.logo = 'File size should not exceed 5MB';
    }
  }

  // Required field validations
  if (!form1Data.contact_person?.trim()) {
    errors.contact_person = 'Contact person name is required';
  }

 

  if (!form1Data.Aggrigator_Email?.trim()) {
    errors.Aggrigator_Email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form1Data.Aggrigator_Email)) {
      errors.Aggrigator_Email = 'Please enter a valid email address';
    }
  }

  if (!form1Data.Aggrigator_mobile?.trim()) {
    errors.Aggrigator_mobile = 'Mobile number is required';
  } else if (!/^\d{10}$/.test(form1Data.Aggrigator_mobile)) {
    errors.Aggrigator_mobile = 'Please enter a valid 10-digit mobile number';
  }

  // Location validations
  if (!form1Data.companyCountry?.trim()) {
    errors.companyCountry = 'Country is required';
  }

  if (!form1Data.companyState?.trim()) {
    errors.companyState = 'State is required';
  }

  if (!form1Data.companyDistrict?.trim()) {
    errors.companyDistrict = 'District is required';
  }

  // // Company details
  // if (!form1Data.courierName?.trim()) {
  //   errors.courierName = 'Courier name is required';
  // }

  if (!form1Data.companyAddress?.trim()) {
    errors.companyAddress = 'Company address is required';
  }

  if (!form1Data.companyName?.trim()) {
    errors.companyName = 'Company name is required';
  }

  // Service details
  if (!form1Data.ProductType?.trim()) {
    errors.ProductType = 'Product type is required';
  }

  // if (!form1Data.serviceType?.trim()) {
  //   errors.serviceType = 'Service type is required';
  // }

  // Date validations
  if (!form1Data.fromDate) {
    errors.fromDate = 'From date is required';
  }

  if (!form1Data.fromTo) {
    errors.fromTo = 'To date is required';
  }

  // Banking details
  // if (!form1Data.accountNumber?.trim()) {
  //   errors.accountNumber = 'Account number is required';
  // }

  if (!form1Data.billingCycle?.trim()) {
    errors.billingCycle = 'Billing cycle is required';
  }

  if (!form1Data.chooseBank?.trim()) {
    errors.chooseBank = 'Bank selection is required';
  }

  if (!form1Data.creditTerms?.trim()) {
    errors.creditTerms = 'Credit terms are required';
  }

  // Format all errors in a consistent structure
  if (Object.keys(errors).length > 0) {
    return {
      title: "Aggregator Form 1 Validation Errors",
      errors: Object.entries(errors).map(([field, message]) => ({
        field,
        message
      }))
    };
  }

  return null;
}

function validateAggregatorForm3(form3Data) {
  const errors = {};

  // Validate volumetric factor
  if (!form3Data.volumetric_ || isNaN(form3Data.volumetric_) || form3Data.volumetric_ <= 0) {
    errors.volumetric_ = 'Valid volumetric factor is required';
  }

  // Validate minimum chargeable weight
  if (!form3Data['Min.charges_weight'] || isNaN(form3Data['Min.charges_weight']) || form3Data['Min.charges_weight'] <= 0) {
    errors.minChargesWeight = 'Valid minimum chargeable weight is required';
  }

  // Format all errors in a consistent structure
  if (Object.keys(errors).length > 0) {
    return {
      title: "Aggregator Form 3 Validation Errors",
      errors: Object.entries(errors).map(([field, message]) => ({
        field,
        message
      }))
    };
  }

  return null;
}
function validateAggregatorForm3Standard(form3Data) {
  const errors = {};

  // Validate volumetric factor
  if (!form3Data.volumetric_ || isNaN(form3Data.volumetric_) || form3Data.volumetric_ <= 0) {
    errors.volumetric_ = 'Valid volumetric factor is required';
  }

  // Validate minimum chargeable weight


  // Format all errors in a consistent structure
  if (Object.keys(errors).length > 0) {
    return {
      title: "Aggregator Form 3 Validation Errors",
      errors: Object.entries(errors).map(([field, message]) => ({
        field,
        message
      }))
    };
  }

  return null;
}
function validateClientOnboarding(form1Data, form2Data, files, clientPassword, selectedForwarders) {
  const errors = {};

  // File validation
  if (!files || files.length === 0) {
    errors.logo = 'Company logo is required';
  } else {
    const file = files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      errors.logo = 'Only JPG, JPEG, and PNG files are allowed';
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.logo = 'File size should not exceed 5MB';
    }
  }

  // Validate selectedForwarders
  if (!selectedForwarders || !Array.isArray(selectedForwarders) || selectedForwarders.length === 0) {
    errors.selectedForwarders = 'At least one forwarder must be selected';
  }

  // Form1 validations
  // Personal Information
  if (!form1Data.clientName?.trim()) {
    errors.clientName = 'Client name is required';
  }

  if (!form1Data.client_Email?.trim()) {
    errors.client_Email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form1Data.client_Email)) {
      errors.client_Email = 'Please enter a valid email address';
    }
  }

  if (!form1Data.client_mobile?.trim()) {
    errors.client_mobile = 'Mobile number is required';
  } else if (!/^\d{10}$/.test(form1Data.client_mobile)) {
    errors.client_mobile = 'Please enter a valid 10-digit mobile number';
  }

  // Company Information
  if (!form1Data.companyName?.trim()) {
    errors.companyName = 'Company name is required';
  }

  if (!form1Data.companyAddress?.trim()) {
    errors.companyAddress = 'Company address is required';
  }

  if (!form1Data.companyCountry?.trim()) {
    errors.companyCountry = 'Country is required';
  }

  if (!form1Data.companyState?.trim()) {
    errors.companyState = 'State is required';
  }

  if (!form1Data.companyDistrict?.trim()) {
    errors.companyDistrict = 'District is required';
  }

  // Banking Details
  // if (!form1Data.Bank_account_name?.trim()) {
  //   errors.Bank_account_name = 'Bank account name is required';
  // }

  // if (!form1Data.accountNumber?.trim()) {
  //   errors.accountNumber = 'Account number is required';
  // }

  if (!form1Data.billingCycle?.trim()) {
    errors.billingCycle = 'Billing cycle is required';
  }

  // if (!form1Data.chooseBank?.trim()) {
  //   errors.chooseBank = 'Bank selection is required';
  // }

  // GST Validation
  // if (!form1Data.gstNo) {
  //   const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  //   if (!gstRegex.test(form1Data.gstNo)) {
  //     errors.gstNo = 'Please enter a valid GST number';
  //   }
  // }
  

  // Date Validations
  if (!form1Data.fromDate) {
    errors.fromDate = 'From date is required';
  }

  if (!form1Data.fromTo) {
    errors.fromTo = 'To date is required';
  }

  // Password validation
  if (!clientPassword) {
    errors.password = 'Password is required';
  } else {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(clientPassword)) {
      errors.password = 'Password must be at least 8 characters long and contain: ' +
        '\n- One uppercase letter' +
        '\n- One lowercase letter' +
        '\n- One number' +
        '\n- One special character (@$!%*?&)';
    }
  }

  // Format all errors in a consistent structure
  if (Object.keys(errors).length > 0) {
    return {
      title: "Client Onboarding Validation Errors",
      errors: Object.entries(errors).map(([field, message]) => ({
        field,
        message
      }))
    };
  }

  return null;
}

function validateClientSignIn(data, files) {
  const errors = {};

  // File validation
  if (!files || files.length === 0) {
    errors.photo = 'Profile photo is required';
  } else {
    const file = files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      errors.photo = 'Only JPG, JPEG, and PNG files are allowed';
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.photo = 'File size should not exceed 5MB';
    }
  }

  // Personal Information validation
  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
  }

  if (!data.mobileNo?.trim()) {
    errors.mobileNo = 'Mobile number is required';
  } else if (!/^\d{10}$/.test(data.mobileNo)) {
    errors.mobileNo = 'Please enter a valid 10-digit mobile number';
  }

  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
  } else {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(data.password)) {
      errors.password = 'Password must be at least 8 characters long and contain: ' +
        '\n- One uppercase letter' +
        '\n- One lowercase letter' +
        '\n- One number' +
        '\n- One special character (@$!%*?&)';
    }
  }

  // Role validation
  if (!data.role) {
    errors.role = 'Role is required';
  } else if (![1, 2, 3, 4, 5, 6].includes(Number(data.role))) {
    errors.role = 'Invalid role selected';
  }

  // Reporting user validation
  if (!data.reportingUser) {
    errors.reportingUser = 'Reporting user is required';
  } else {
    // Convert to number and check if it's a valid integer
    const reportingUserId = Number(data.reportingUser);
    if (isNaN(reportingUserId) || !Number.isInteger(reportingUserId) || reportingUserId <= 0) {
      errors.reportingUser = 'Reporting user must be a valid positive integer';
    }
  }

  // Client validation
  if (!data.client) {
    errors.client = 'Client is required';
  } else {
    // Convert to number and check if it's a valid integer
    const clientId = Number(data.client);
    if (isNaN(clientId) || !Number.isInteger(clientId) || clientId <= 0) {
      errors.client = 'Client must be a valid positive integer';
    }
  }

  // Format all errors in a consistent structure
  if (Object.keys(errors).length > 0) {
    return {
      title: "Client Sign In Validation Errors",
      errors: Object.entries(errors).map(([field, message]) => ({
        field,
        message
      }))
    };
  }

  return null;
}

module.exports = {
  validateCustomerDetails,
  validateMultiOrderData,
  validateWarehouseData,
  validateForwarderForm1,
  validateAggregatorForm1,
  validateAggregatorForm3,
  validateAggregatorForm3Standard,
  validateClientOnboarding,
  validateClientSignIn,
  validateExpressCreateOrderData
};
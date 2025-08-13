const { mySqlQury } = require("../middleware/db");

let deliveryApi = null;
let tokenExpiry = null;

async function importXLSXData() {
  try {
    const workbook = xlsx.readFile('e:/Development/dispatchlive/data/SBAAR.xlsx');
    
    // Get first worksheet
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Get first row name 
    const firstRow = worksheet['A1'] ? worksheet['A1'].v : null;
    console.log('First row name:', firstRow);

    // Start database transaction
    await mySqlQury('START TRANSACTION');

    const data = xlsx.utils.sheet_to_json(worksheet);

    for (const row of data) {
      // Insert order data with client_id 67
      const orderValues = [
        row['Order No'], // order_id
        row['Order No'], // po_no (same as order_id) 
        row['Customer Name'], // consignee_name
        row['Customer Phone'], // consignee_phone
        '', // consignee_email
        row['Shiping Address'], // consignee_address
        new Date(), // order_date
        'COD', // payment_type
        0, // total_weight
        1, // total_boxes
        '', // origin
        row['Shiping State'], // destination_state
        row['Shiping City'], // destination_city
        row['Shiping Pincode'], // destination_pincode
        row['Product Price'], // Amount
        '', // Check_Favour_Of
        0, // Check_Amount
        '', // origin_city
        '', // origin_state
        '', // origin_pincode
        '', // warehouse_address
        '', // warehouse_contact_person
        67, // client_id - Set to 67
        '', // warehouse_email
        'Standard', // order_type
        row['Product Price'], // Invoice_amount
        '', // invoice_no
        'KG', // weight_unit
        '', // warehouse_name
        0, // is_unprocessed
        67 // client_id - Set to 67
      ];

      const orderResult = await mySqlQury(
        `INSERT INTO tbl_unprocessed_order (
          order_id, po_no, consignee_name, consignee_phone, consignee_email, consignee_address,
          order_date, payment_type, total_weight, total_boxes, origin, destination_state,
          destination_city, destination_pincode, Amount, Check_Favour_Of, Check_Amount,
          origin_city, origin_state, origin_pincode, warehouse_address, warehouse_contact_person,
          client_id, warehouse_email, order_type, Invoice_amount, invoice_no, weight_unit, warehouse_name,
          is_unprocessesd
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        orderValues
      );

      // Insert LR data with client_id 67
      const lrValues = [
        row['Order No'], // order_id
        row['Order No'], // po_id
        row['LR'], // lr_No
        row['Customer Name'], // consignee_Name
        'Carrier', // insurance_Type
        '', // pickup_Pincode
        row['Shiping Pincode'], // destination_Pincode
        '', // pickup_Add
        row['Shiping Address'], // destination_Add
        0, // total_Weight
        1, // total_Box
        'COD', // mode_Of_Payment
        row['Product Price'], // invoice_Value
        '', // invoice_No
        '', // eway_bill
        '', // shipper_Gst
        '', // consignee_Gst
        67 // client_id - Set to 67
      ];

      await mySqlQury(
        `INSERT INTO tbl_create_lr (
          order_id, po_id, lr_No, order_date, consignee_Name,
          insurance_Type, pickup_Pincode, destination_Pincode, pickup_Add, destination_Add,
          total_Weight, total_Box, mode_Of_Payment, invoice_Value, invoice_No, eway_bill,
          shipper_Gst, consignee_Gst, client_id
        ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        lrValues
      );
    }

    await mySqlQury('COMMIT');
    console.log('XLSX data imported successfully');

  } catch (error) {
    await mySqlQury('ROLLBACK');
    console.error('Error importing XLSX data:', error);
  }
}

module.exports = importXLSXData
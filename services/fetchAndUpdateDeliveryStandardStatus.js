const axios = require("axios");
const { mySqlQury } = require("../middleware/db");
const fetchAndUpdateDeliveryStandardStatus = async () => {
  try {
    const selectSql = `
    SELECT lr_No 
    FROM tbl_create_lr 
    WHERE Tagged_api IN ('Delhivery/Standard-Surface', 'Delhivery/Standard-surface', 'Delhivery/Standard-Air', 'Delhivery/Standard-air',"Delhivery/Standard-Surface")
    AND status NOT IN (0, 4)`;

    const selectResults = await mySqlQury(selectSql);
    console.log("Selected results for the delivery: ", selectResults);

    for (const row of selectResults) {
      const lrNo = row.lr_No;
      console.log("Loading ", lrNo);
      try {
        const token = process.env.DELHIVERY_STD;
        const apiUrl = `https://track.delhivery.com/api/v1/packages/json?waybill=${lrNo}&token=${token}`;
        
        const response = await axios.get(apiUrl);
        console.log("Response from server: ", JSON.stringify(response.data, null, 2));

        const shipmentData = response.data.ShipmentData;
        if (shipmentData && shipmentData.length > 0) {
          for (const shipment of shipmentData) {
            const scans = shipment.Shipment.Scans;

            for (const scan of scans) {
              const {
                ScanDateTime,
                ScanType,
                Scan,
                StatusDateTime,
                ScannedLocation,
                StatusCode,
                Instructions
              } = scan.ScanDetail;

              // Check if the StatusCode already exists for this lrNo
              const checkScanSql = `
                SELECT COUNT(*) AS count 
                FROM tbl_delivery_standard_status 
                WHERE lrnum = ? AND status_code = ?`;
              const scanCheckResult = await mySqlQury(checkScanSql, [lrNo, StatusCode]);
              const statusCodeExists = scanCheckResult[0].count > 0;

              // Insert a new record only if the StatusCode does not exist
              if (!statusCodeExists) {
                const insertSql = `
                  INSERT INTO tbl_delivery_standard_status 
                  (lrnum, scan_datetime, scan_type, scan, status_datetime, scanned_location, status_code, instructions)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                const insertValues = [
                  lrNo,
                  ScanDateTime,
                  ScanType,
                  Scan,
                  StatusDateTime,
                  ScannedLocation,
                  StatusCode,
                  Instructions
                ];

                await mySqlQury(insertSql, insertValues);
                console.log(`Scan inserted for lrnum: ${lrNo} - StatusCode: ${StatusCode}`);
              } else {
                console.log(`StatusCode '${StatusCode}' already exists for lrnum: ${lrNo}`);
              }

              // Update status in tbl_create_lr based on the Scan and ScanType values
              let newStatus = null;
              if (Scan === "In Transit" && ScanType === "UD") {
                newStatus = 3; // Set status to 3 if Scan is "In Transit" and ScanType is "UD"
              } else if (Scan === "In Transit" && ScanType === "RT" && StatusCode === "X-ILL1F") {
                newStatus = 7; // Set status to 5 if Scan is "In Transit" and ScanType is "RT" previos i used 5 for the return to origin
        
              } else if (Scan === "Delivered") {
                newStatus = 4;
              } else if (Scan === "Not Picked") {
                newStatus = 0; // Handle the "Not Picked" scan case
              }
              else if (StatusCode === "ST-108" || StatusCode === "ST-144" || StatusCode === "EOD-11" || StatusCode === "EOD-6") {
                newStatus = 6; // here this is NDR cases
              }
              else if(StatusCode === "X-DDD3FD"){
                newStatus = 8; // out for delivery
              }else if(StatusCode === "RD-AC"){
                newStatus = 5; // out for delivery
              }

              if (newStatus !== null) {
                const updateStatusSql = `
                  UPDATE tbl_create_lr 
                  SET status = ? 
                  WHERE lr_No = ? AND status != ?`;
                await mySqlQury(updateStatusSql, [newStatus, lrNo, newStatus]);
                console.log(`Updated status to ${newStatus} for lrnum: ${lrNo} (Scan: ${Scan})`);
              }
            }
          }
        } else {
          console.log(`No valid delivery data for lrnum: ${lrNo}. Response: `, response.data);
        }
      } catch (apiError) {
        console.error(`API error for lrnum ${lrNo}:`, apiError.response ? apiError.response.data : apiError.message);
      }
    }
  } catch (error) {
    console.error('Error fetching lr_No:', error);
  }
};

const fetchAndUpdateDeliveryStandardStatusEcom = async () => {
  try {
    const selectSql = `
    SELECT lr_No 
    FROM tbl_create_lr 
    WHERE Tagged_api IN ('Delhivery/Standard-Surface', 'Delhivery/Standard-surface', 'Delhivery/Standard-Air', 'Delhivery/Standard-air',"Delhivery/Standard-Surface")
    AND status NOT IN (0, 4)`;

    const selectResults = await mySqlQury(selectSql);
    console.log("Selected results for the delivery: ", selectResults);

    for (const row of selectResults) {
      const lrNo = row.lr_No;
      console.log("Loading ", lrNo);
      try {
        const token = process.env.DELHIVERY_STD;
        const apiUrl = `https://track.delhivery.com/api/v1/packages/json?waybill=${lrNo}&token=${token}`;
        
        const response = await axios.get(apiUrl);
        console.log("Response from server: ", JSON.stringify(response.data, null, 2));

        const shipmentData = response.data.ShipmentData;
        if (shipmentData && shipmentData.length > 0) {
          for (const shipment of shipmentData) {
            const scans = shipment.Shipment.Scans;

            for (const scan of scans) {
              const {
                ScanDateTime,
                ScanType,
                Scan,
                StatusDateTime,
                ScannedLocation,
                StatusCode,
                Instructions
              } = scan.ScanDetail;

              // Check if the StatusCode already exists for this lrNo
              const checkScanSql = `
                SELECT COUNT(*) AS count 
                FROM tbl_delivery_standard_status 
                WHERE lrnum = ? AND status_code = ?`;
              const scanCheckResult = await mySqlQury(checkScanSql, [lrNo, StatusCode]);
              const statusCodeExists = scanCheckResult[0].count > 0;

              // Insert a new record only if the StatusCode does not exist
              if (!statusCodeExists) {
                const insertSql = `
                  INSERT INTO tbl_delivery_standard_status 
                  (lrnum, scan_datetime, scan_type, scan, status_datetime, scanned_location, status_code, instructions)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                const insertValues = [
                  lrNo,
                  ScanDateTime,
                  ScanType,
                  Scan,
                  StatusDateTime,
                  ScannedLocation,
                  StatusCode,
                  Instructions
                ];

                await mySqlQury(insertSql, insertValues);
                console.log(`Scan inserted for lrnum: ${lrNo} - StatusCode: ${StatusCode}`);
              } else {
                console.log(`StatusCode '${StatusCode}' already exists for lrnum: ${lrNo}`);
              }

              // Update status in tbl_create_lr based on the Scan and ScanType values
              let newStatus = null;
              if (Scan === "In Transit" && ScanType === "UD") {
                newStatus = 3; // Set status to 3 if Scan is "In Transit" and ScanType is "UD"
              } else if (Scan === "In Transit" && ScanType === "RT" && StatusCode === "X-ILL1F") {
                newStatus = 5; // Set status to 5 if Scan is "In Transit" and ScanType is "RT" previos i used 5 for the return to origin
        
              } else if (Scan === "Delivered") {
                newStatus = 4;
              } else if (Scan === "Not Picked") {
                newStatus = 0; // Handle the "Not Picked" scan case
              }
              else if (StatusCode === "ST-108" || StatusCode === "ST-144" || StatusCode === "EOD-11" || StatusCode === "EOD-6") {
                newStatus = 7; // here this is NDR cases
              }
              else if(StatusCode === "X-DDD3FD"){
                newStatus = 8; // out for delivery
              }

              if (newStatus !== null) {
                const updateStatusSql = `
                  UPDATE tbl_create_lr 
                  SET status = ? 
                  WHERE lr_No = ? AND status != ?`;
                await mySqlQury(updateStatusSql, [newStatus, lrNo, newStatus]);
                console.log(`Updated status to ${newStatus} for lrnum: ${lrNo} (Scan: ${Scan})`);
              }
            }
          }
        } else {
          console.log(`No valid delivery data for lrnum: ${lrNo}. Response: `, response.data);
        }
      } catch (apiError) {
        console.error(`API error for lrnum ${lrNo}:`, apiError.response ? apiError.response.data : apiError.message);
      }
    }
  } catch (error) {
    console.error('Error fetching lr_No:', error);
  }
};

const syncShopifyOrders = async () => {
  try {
    const integrations = await mySqlQury(
      "SELECT clientId, shopyfy_url, accessToken FROM tbl_shopify_integration"
    );

    for (const integration of integrations) {
      const { clientId, shopyfy_url, accessToken } = integration;

      let origin_pincode = '';
      let origin_state = '';
      let origin_city = '';
      let title;
      let height = null;
      let width = null;
      let length = null;
      let unit = null;
      let weightUnit = null;

      const values = [];
      const productValues = [];
      const boxValues = [];
      const orderValue = [];

      // 🔹 Get Orders
      const orderResponse = await axios.get(`https://${shopyfy_url}/admin/api/2023-10/orders.json`, {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken
        }
      });

      // 🔹 Get Locations
      const locationResponse = await axios.get(`https://${shopyfy_url}/admin/api/2025-07/locations.json`, {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken
        }
      });

      const locations = locationResponse.data.locations || [];
      const orders = orderResponse.data.orders || [];
      // console.log("orders data whole",orders)

      for (const order of orders) {
        const order_id =order.order_number;

        // Skip if already exists
        const exists = await mySqlQury(
          "SELECT 1 FROM tbl_ecom_orders WHERE orderid = ? LIMIT 1",
          [order_id]
        );
        if (exists.length) continue;

        // Get origin details
        const locationData = locations.find(loc => loc.id == order.location_id);
        if (locationData) {
          origin_pincode = locationData.zip || '';
          origin_state = locationData.province || '';
          origin_city = locationData.city || '';
        }

        // Get metafields
        const metaResponse = await axios.get(
          `https://${shopyfy_url}/admin/api/2025-07/orders/${order.id}/metafields.json`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": accessToken
            }
          }
        );

        const metafields = metaResponse.data.metafields || [];
        metafields.forEach((field) => {
          if (field.namespace === 'shipping') {
            try {
              const parsed = JSON.parse(field.value);
              if (field.key === 'height') {
                height = Number(parsed.value);
                unit = parsed.unit;
              }
              if (field.key === 'width') {
                width = Number(parsed.value);
                unit = parsed.unit;
              }
              if (field.key === 'length') {
                length = Number(parsed.value);
                unit = parsed.unit;
              }
            } catch (err) {
              console.warn(`Could not parse metafield: ${field.key}`);
            }
          }
        });

        // 🔹 Get weight key name
        weightUnit = Object.keys(order.line_items?.[0] || {}).find(k => k === 'grams');

        for (const tax_lines of order.tax_lines || []) {
          title = tax_lines.title;
        }

        // Product details
        for (const lineItem of order.line_items || []) {
          values.push([
            order_id,
            "shopify",
            `${order.shipping_address?.first_name || ''} ${order.shipping_address?.last_name || ''}`.trim(),
            Number(order.current_subtotal_price),
            String(lineItem?.sku || ''),
            Number(lineItem?.quantity || 0),
            2.5,
            "Percent",
            title
          ]);

          productValues.push([
            order_id,
            "shopify",
            Number(length || 0),
            Number(width || 0),
            Number(height || 0),
            String(unit || ''),
            Number(lineItem?.grams || 0),
            weightUnit
          ]);
        }

        const existingWareHouseId = await mySqlQury(
          "SELECT serial,warehouse_id FROM tbl_add_warehouse WHERE client_id = ?",
          [clientId]
        );

        // Box details
        boxValues.push([
          "shopify",
          String(order.reference || ''),
          order_id,
          order_id,
          Number(clientId),
          String(order?.payment_terms || ''),
          8.9,
          String(existingWareHouseId[0]?.serial || ''),
          Number(order.total_weight || 0),
          weightUnit,
          Number(order.current_total_price || 0),
          Number(order.line_items?.reduce((acc, item) => acc + item.quantity, 0) || 0),
          1,
          Number(order.current_total_tax || 0),
          Number(order.total_discounts || 0),
          1
        ]);

        // Consignee details
        orderValue.push([
          order_id,
          (order.shipping_address?.first_name || '').trim(),
          (order.shipping_address?.last_name || '').trim(),
          String(order?.contact_email || ''),
          String(order?.phone || ''),
          String(order?.phone || ''),
          order.shipping_address?.address1 || '',
          order.shipping_address?.address2 || '',
          order.shipping_address?.address1 || '',
          order.shipping_address?.country || '',
          order.shipping_address?.province || '',
          order.shipping_address?.city || '',
          order.shipping_address?.zip || '',
          1,
          (order.billing_address?.first_name || '').trim(),
          (order.billing_address?.last_name || '').trim(),
          String(order?.contact_email || ''),
          (order.billing_address?.phone || '').trim(),
          (order.billing_address?.phone || '').trim(),
          order.billing_address?.address1 || '',
          order.billing_address?.address2 || '',
          order.billing_address?.address1 || '',
          order.billing_address?.country || '',
          order.billing_address?.province || '',
          order.billing_address?.city || '',
          order.billing_address?.zip || ''
        ]);
      }

      // Insert queries
      if (values.length) {
        await mySqlQury(`INSERT IGNORE INTO tbl_ecom_product_details (
          order_id, category, name, price, sku, quantity, discount_value, discount_type, tax_type
        ) VALUES ?`, [values]);
      }

      if (productValues.length) {
        await mySqlQury(`INSERT IGNORE INTO tbl_ecom_boxes_details (
          order_id, package_type, length, breadth, height, dimension_unit, weight, weight_unit
        ) VALUES ?`, [productValues]);
      }

      if (boxValues.length) {
        await mySqlQury(`INSERT IGNORE INTO tbl_ecom_orders (
          channel, ref_number, orderid, invoice_no, client_id, payment_mode, collectable_amount, warehouse_id, 
          total_weight, weight_unit, grand_total, total_qty, box_qty, total_tax, total_discount, is_unprocessed
        ) VALUES ?`, [boxValues]);
      }

      if (orderValue.length) {
        await mySqlQury(`INSERT IGNORE INTO tbl_ecom_consignee_details (
          order_id, first_name, last_name, email, phone, alternate_phone, address_line1, address_line2, landmark,
          country, state, city, pincode, billing_same_as_shipping, billing_first_name, billing_last_name, billing_email,
          billing_phone, billing_alternate_phone, billing_address_line1, billing_address_line2, billing_landmark,
          billing_country, billing_state, billing_city, billing_pincode
        ) VALUES ?`, [orderValue]);
      }

      console.log(`✅ Client ${clientId} orders synced`);
    }
  } catch (err) {
    console.error("❌ Shopify Sync Error:", err.message);
  }
}

module.exports= {fetchAndUpdateDeliveryStandardStatus,fetchAndUpdateDeliveryStandardStatusEcom,syncShopifyOrders}
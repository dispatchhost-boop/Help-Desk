const axios = require("axios");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const getValidDeliveryApiToken = require("./getValidDeliveryApiToken");
const { mySqlQury } = require("../middleware/db");
const fetchAndUpdateDeliveryStatus = async () => {
  try {
    const selectSql = `SELECT lr_No FROM tbl_create_lr WHERE Tagged_api = 'Delhivery/LTL-surface' AND status NOT IN (0,3,4)`;

      const selectResults = await mySqlQury(selectSql);
      console.log("selected results: for the delivery " + selectResults)

      for (const row of selectResults) {
          const lrNo = row.lr_No;
          try { 
              const token = await getValidDeliveryApiToken(); // Get a valid token before making API request
              const response = await axios.get(
                  `https://ltl-clients-api.delhivery.com/lrn/track?lrnum=${lrNo}`, {
                  headers: {
                      'Authorization': `Bearer ${token}`
                  }
              });
              console.log("response from server: " + response)

              if (response.data.success) {
                const { data } = response.data;
                const deliveryData = data.wbns;
              
                // Loop through each entry in wbns
                for (const wb of deliveryData) {
                  const {
                    status,
                    location,
                    wbn,
                    count,
                    manifested_date,
                    scan_remark,
                    scan_timestamp,
                    estimated_date,
                    promised_delivery_date,
                    pickup_date,
                    delivered_date
                  } = wb;

                  // Update status in tbl_create_lr based on delivery status
                  if (status === 'LEFT_ORIGIN' || status === 'PICKED_UP') {
                    const updateStatusSql = `
                      UPDATE tbl_create_lr 
                      SET status = ? 
                      WHERE lr_No = ? AND status != ?`;
                    await mySqlQury(updateStatusSql, [3, lrNo, 3]);
                  } else if (status === 'DELIVERED') {
                    const updateStatusSql = `
                      UPDATE tbl_create_lr 
                      SET status = ? 
                      WHERE lr_No = ? AND status != ?`;
                    await mySqlQury(updateStatusSql, [4, lrNo, 4]);
                  }
              
                  // Check if the status already exists for this lrNo
                  const checkStatusSql = `
                    SELECT COUNT(*) AS count 
                    FROM tbl_delivery_status 
                    WHERE lrnum = ? AND status = ?`;
                  const statusCheckResult = await mySqlQury(checkStatusSql, [lrNo, status]);
                  const statusExists = statusCheckResult[0].count > 0;
              
                  // Insert a new record only if the status does not exist
                  if (!statusExists) {
                    const insertSql = `
                      INSERT INTO tbl_delivery_status 
                      (lrnum, status, location, wbn, count, date, scan_remark, scan_timestamp, estimated_date, promised_delivery_date, pickup_date,manifested_date,delivered_date)
                      VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?,?,?)`;
                    const insertValues = [
                      lrNo,
                      status,
                      location,
                      wbn,
                      count,
                      scan_remark,
                      scan_timestamp,
                      estimated_date || null,
                      promised_delivery_date || null,
                      pickup_date || null,
                      manifested_date || null,
                      delivered_date  || null
                    ];
              
                    await mySqlQury(insertSql, insertValues);
                    console.log(`Status inserted for lrnum: ${lrNo} - ${status}`);
                  } else {
                    console.log(`Status '${status}' already exists for lrnum: ${lrNo}`);
                  }
                }
              } else {
                console.log(`No valid delivery data for lrnum: ${lrNo}`);
              }
            } catch (apiError) {
              console.error(`API error for lrnum ${lrNo}:`, apiError.message);
            }
          }
        } catch (error) {
          console.error('Error fetching lr_No:', error);
        }
      };
      
      module.exports = {fetchAndUpdateDeliveryStatus}
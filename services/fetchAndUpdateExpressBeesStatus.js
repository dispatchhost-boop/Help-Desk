const axios = require("axios");
const { mySqlQury } = require("../middleware/db");
const fetchExpressBeesToken = require("./fetchExpressBeesToken");
const fetchAndUpdateExpressBeesStatus = async () => {
  try {
    // Fetch LR numbers for ExpressBees
    const token = await fetchExpressBeesToken();
    const selectSql = `
  SELECT lr_No 
  FROM tbl_create_lr 
  WHERE LOWER(Tagged_api) LIKE 'expressbees%' 
  AND status NOT IN (4, 5)`;
    const selectResults = await mySqlQury(selectSql);
    console.log("Selected results for ExpressBees:", selectResults);

    for (const row of selectResults) {
      const lrNo = row.lr_No;

      try {
        // Make the API call to ExpressBees
        const response = await axios.get(
          `https://shipment.xpressbees.com/api/shipments2/track/${lrNo}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Use the token variable
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.data && response.data.data) {
          const { data } = response.data;

          // Update status to cancelled if applicable
          if (data.status && data.status.toLowerCase() === "cancelled") {
            const updateSql = `
              UPDATE tbl_create_lr 
              SET status = 0 
              WHERE lr_No = ?`;
            await mySqlQury(updateSql, [lrNo]);
            console.log(`Updated status to 0 for lrnum: ${lrNo} (Status: Cancelled)`);
          }

          // Process history entries if available
          if (data.history && Array.isArray(data.history)) {
            // Loop through history entries from newest to oldest
            const history = [...data.history];
            
            // Track if we've already updated the status
            let statusUpdated = false;
            
            for (const entry of history) {
              if (!entry) continue;
              
              const { 
                status_code, 
                location, 
                event_time: actionDate, 
                message 
              } = entry;
              
              if (!status_code || !message) continue;
              
              console.log("Processing history entry:", message, lrNo);

              // Update status in tbl_create_lr based on status_code
              if (!statusUpdated) {
                let newStatus = null;
                
                // Map status_code to status values
                if (status_code === "PP") {
                  newStatus = 2; // Pickup status
                } else if (status_code === "IT") {
                  newStatus = 3; // In Transit
                } else if (status_code === "DL") {
                  newStatus = 4; // Delivered
                } else if (status_code === "RT-DL") {
                  newStatus = 5; // RTO Delivered return to origin
                } else if (status_code === "RT-IT") {
                  newStatus = 7; // RTO In Transit return to origin
                } else if (status_code === "EX") {
                  newStatus = 6; // Exception this is NDR
                }
                else if (status_code === "OFD") {
                  newStatus = 8; // Exception this is NDR
                }
                
                if (newStatus !== null) {
                  const updateStatusSql = `
                    UPDATE tbl_create_lr 
                    SET status = ? 
                    WHERE lr_No = ? AND status != ?`;
                  await mySqlQury(updateStatusSql, [newStatus, lrNo, newStatus]);
                  console.log(`Updated status to ${newStatus} for lrnum: ${lrNo} (Status Code: ${status_code})`);
                  statusUpdated = true;
                }
              }

              // Check if the status already exists for this lrNo with the same status_code and message
              const checkStatusSql = `
                SELECT COUNT(*) AS count 
                FROM tbl_expressbees_status 
                WHERE lrnum = ? AND status_code = ? AND LOWER(message) = LOWER(?)`;
              const statusCheckResult = await mySqlQury(checkStatusSql, [lrNo, status_code, message]);
              const statusExists = statusCheckResult[0].count > 0;

              // If the status does not exist, insert it
              if (!statusExists) {
                const insertSql = `
                  INSERT INTO tbl_expressbees_status 
                  (lrnum, location, event_time, message, date, status_code)
                  VALUES (?, ?, ?, ?, NOW(), ?)`;
                const insertValues = [lrNo, location, actionDate, message, status_code];

                await mySqlQury(insertSql, insertValues);
                console.log(`Data inserted for lrnum: ${lrNo} - ${message} (${status_code})`);
              } else {
                console.log(`Status '${status_code}' with message '${message}' already exists for lrnum: ${lrNo}`);
              }
            }
          } else {
            console.log(`No history data available for lrnum: ${lrNo}`);
          }
        } else {
          console.log(`No valid shipment data for lrnum: ${lrNo}`);
        }
      } catch (apiError) {
        console.error(`API error for lrnum ${lrNo}:`, apiError.message);
      }
    }
  } catch (error) {
    console.error("Error fetching lr_No:", error);
  }
};
//chnaged by me
const fetchAndUpdateExpressBeesStatusEcom = async () => {
  try {
    // Fetch LR numbers for ExpressBees
    const token = await fetchExpressBeesToken();
    const selectSql = `
  SELECT lr_No 
  FROM tbl_create_lr 
  WHERE LOWER(Tagged_api) LIKE 'expressbees%' 
  AND status NOT IN (4, 5)`;
    const selectResults = await mySqlQury(selectSql);
    console.log("Selected results for ExpressBees:", selectResults);

    for (const row of selectResults) {
      const lrNo = row.lr_No;

      try {
        // Make the API call to ExpressBees
        const response = await axios.get(
          `https://shipment.xpressbees.com/api/shipments2/track/${lrNo}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Use the token variable
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.data && response.data.data) {
          const { data } = response.data;

          // Update status to cancelled if applicable
          if (data.status && data.status.toLowerCase() === "cancelled") {
            const updateSql = `
              UPDATE tbl_create_lr 
              SET status = 0 
              WHERE lr_No = ?`;
            await mySqlQury(updateSql, [lrNo]);
            console.log(`Updated status to 0 for lrnum: ${lrNo} (Status: Cancelled)`);
          }

          // Process history entries if available
          if (data.history && Array.isArray(data.history)) {
            // Loop through history entries from newest to oldest
            const history = [...data.history];
            
            // Track if we've already updated the status
            let statusUpdated = false;
            
            for (const entry of history) {
              if (!entry) continue;
              
              const { 
                status_code, 
                location, 
                event_time: actionDate, 
                message 
              } = entry;
              
              if (!status_code || !message) continue;
              
              console.log("Processing history entry:", message, lrNo);

              // Update status in tbl_create_lr based on status_code
              if (!statusUpdated) {
                let newStatus = null;
                
                // Map status_code to status values
                if (status_code === "PP") {
                  newStatus = 2; // Pickup status
                } else if (status_code === "IT") {
                  newStatus = 3; // In Transit
                } else if (status_code === "DL") {
                  newStatus = 4; // Delivered
                } else if (status_code === "RT-DL") {
                  newStatus = 5; // RTO Delivered return to origin
                } else if (status_code === "RT-IT") {
                  newStatus = 7; // RTO In Transit return to origin
                } else if (status_code === "EX") {
                  newStatus = 6; // Exception this is NDR
                }
                else if (status_code === "OFD") {
                  newStatus = 8; // Exception this is NDR
                }
                
                if (newStatus !== null) {
                  const updateStatusSql = `
                    UPDATE tbl_create_lr 
                    SET status = ? 
                    WHERE lr_No = ? AND status != ?`;
                  await mySqlQury(updateStatusSql, [newStatus, lrNo, newStatus]);
                  console.log(`Updated status to ${newStatus} for lrnum: ${lrNo} (Status Code: ${status_code})`);
                  statusUpdated = true;
                }
              }

              // Check if the status already exists for this lrNo with the same status_code and message
              const checkStatusSql = `
                SELECT COUNT(*) AS count 
                FROM tbl_expressbees_status 
                WHERE lrnum = ? AND status_code = ? AND LOWER(message) = LOWER(?)`;
              const statusCheckResult = await mySqlQury(checkStatusSql, [lrNo, status_code, message]);
              const statusExists = statusCheckResult[0].count > 0;

              // If the status does not exist, insert it
              if (!statusExists) {
                const insertSql = `
                  INSERT INTO tbl_expressbees_status 
                  (lrnum, location, event_time, message, date, status_code)
                  VALUES (?, ?, ?, ?, NOW(), ?)`;
                const insertValues = [lrNo, location, actionDate, message, status_code];

                await mySqlQury(insertSql, insertValues);
                console.log(`Data inserted for lrnum: ${lrNo} - ${message} (${status_code})`);
              } else {
                console.log(`Status '${status_code}' with message '${message}' already exists for lrnum: ${lrNo}`);
              }
            }
          } else {
            console.log(`No history data available for lrnum: ${lrNo}`);
          }
        } else {
          console.log(`No valid shipment data for lrnum: ${lrNo}`);
        }
      } catch (apiError) {
        console.error(`API error for lrnum ${lrNo}:`, apiError.message);
      }
    }
  } catch (error) {
    console.error("Error fetching lr_No:", error);
  }
};

module.exports = {fetchAndUpdateExpressBeesStatus,fetchAndUpdateExpressBeesStatusEcom}
const { mySqlQury } = require("../middleware/db");
const axios = require("axios");
const fetchAndUpdateDTDCStandardStatus = async () => {
  try {
    const selectSql = `
  SELECT lr_No 
  FROM tbl_create_lr 
  WHERE status NOT IN (4, 5)
  AND Tagged_api IN (
    'DTDC/B2C PRIORITY', 
    'DTDC/B2C SMART EXPRESS', 
    'DTDC/B2C PREMIUM', 
    'DTDC/B2C GROUND ECONOMY', 
    'DTDC/PRIORITY', 
    'DTDC/GROUND EXPRESS', 
    'DTDC/PREMIUM', 
    'DTDC/STD EXP-A'
  )`;
  
    const selectResults = await mySqlQury(selectSql);
    console.log("Selected results for DTDC Standard:", selectResults);

    for (const row of selectResults) {
      const lrNo = row.lr_No;

      try {
        const token = process.env.DTDC_ACCESS_TOKEN;

        const response = await axios.post(
          'https://blktracksvc.dtdc.com/dtdc-api/rest/JSONCnTrk/getTrackDetails',
          {
            trkType: "cnno",
            strcnno: lrNo,
            addtnlDtl: "Y",
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token,
            },
          }
        );

        console.log("API Response:", response.data);

        if (response.data && response.data.statusFlag && response.data.status === 'SUCCESS') {
          const actions = response.data.trackDetails;

          for (const action of actions) {
            console.log("action in standard", action);
            const {
              strCode,
              strAction: current_status,
              strManifestNo: wbn,
              strOrigin: origin,
              strDestination: destination,
              strActionDate: actionDate,
              strActionTime: actionTime,
              strVehicleNo: vehicleNo,
              strDriverName: driverName,
              strDriverNo: driverNo,
              strDocWeight: docWeight,
              strMfMode: mfMode,
              strAddress: address,
              strMobileNo: mobileNo,
              strEmailID: emailID,
              strRemarks: remarks,
              strAttempt: attempt,
              strError: error,
            } = action;
            let newStatus;
            switch (current_status) {
              case "Picked Up":
                newStatus = 2;
                break;
              case "In Transit":
                newStatus = 3;
                break;
              case "Delivered":
                newStatus = 4;
                break;
              case "Out For Delivery":
                newStatus = 8;
                break;
              case "Waiting For RTO Approval From Origin":
                newStatus = 5;
                break;  
              case "Pickup Cancelled":
                newStatus = 0;
                break;
              default:
                newStatus = null; // Or handle as needed for unknown actions
            }

            // If a valid newStatus exists, update the tbl_create_lr status
            if (newStatus !== null) {
              const updateStatusSql = `
                UPDATE tbl_create_lr 
                SET status = ? 
                WHERE lr_No = ? AND status != ?`;

              await mySqlQury(updateStatusSql, [newStatus, lrNo, newStatus]);
              console.log(`Updated status to ${newStatus} for lrnum: ${lrNo} `);
            }

            // Format the date string to MySQL date format (YYYY-MM-DD)
            const formattedDate = actionDate ? 
              `${actionDate.slice(4)}${actionDate.slice(2,4)}${actionDate.slice(0,2)}` : null;

            // Check if the status already exists for this lrNo
            const checkStatusSql = `
              SELECT COUNT(*) AS count 
              FROM tbl_dtdc_standard_status 
              WHERE lrnum = ? AND strCode = ?`;
            const statusCheckResult = await mySqlQury(checkStatusSql, [lrNo, strCode]);
            const statusExists = statusCheckResult[0].count > 0;

            // If the status does not exist, insert it
            if (!statusExists) {
              const insertSql = `
                INSERT INTO tbl_dtdc_standard_status 
                (lrnum, strCode,strAction, strManifestNo, strOrigin, strDestination, strActionDate, strActionTime, strVehicleNo, strDriverName, strDriverNo, strDocWeight, strMfMode, strAddress, strMobileNo, strEmailID, strRemarks, strAttempt, strError, created_at)
                VALUES (?, ?, ?, ?, ?, ?, STR_TO_DATE(?, '%Y%m%d'), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?,NOW())`;
              
              const insertValues = [
                lrNo,
                strCode,
                current_status,
                wbn,
                origin,
                destination || null, // Use null if no value is provided
                formattedDate, // Convert string date to MySQL date format
                actionTime || null, // Use null if no value is provided
                vehicleNo || null, // Use null if no value is provided
                driverName || "", // Default to empty string if not provided
                driverNo || "",   // Default to empty string if not provided
                docWeight || null, // Use null if no value is provided
                mfMode || null, // Use null if no value is provided
                address || null, // Use null if no value is provided
                mobileNo || null, // Use null if no value is provided
                emailID || null, // Use null if no value is provided
                remarks || null, // Use null if no value is provided
                attempt || null, // Use null if no value is provided
                error || null, // Use null if no value is provided
              ];
            
              console.log("Insert Values:", insertValues); // Log the values being inserted
              console.log("current statys",current_status)
              await mySqlQury(insertSql, insertValues);
              
            } else {
              console.log(`Status '${current_status}' already exists for lrnum: ${lrNo}`);
              
            }
            

            // Check if the current status is "Pickup cancelled"
            
          }
        } else {
          console.log(`No valid consignment data for lrnum: ${lrNo}. Response:`, response.data);
        }
      } catch (apiError) {
        console.error(`API error for lrnum ${lrNo}:`, apiError.message);
      }
    }
  } catch (error) {
    console.error("Error fetching or processing data:", error.message);
  }
};

module.exports = fetchAndUpdateDTDCStandardStatus
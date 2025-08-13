const { mySqlQury } = require("../middleware/db");
const axios = require("axios");
const fetchAndUpdateDTDCStatus = async () => {
  try {
    const selectSql = `SELECT lr_No FROM tbl_create_lr WHERE Tagged_api = 'DTDC/LTL'`;

    const selectResults = await mySqlQury(selectSql);
    console.log("Selected results dtdc:", selectResults);

    for (const row of selectResults) {
      const lrNo = row.lr_No;

      try {
        // Make the API call
        const response = await axios.post(
          `https://api.mywebxpress.com/tms/dtdc/ops/Docket/TrackDocket/DTDC`,
          {
            TrkType: "cnno",
            strCnno: lrNo,
            addtnlDtl: "Y",
          },
          {
            headers: {
              'XX-Authentication-Token': 'T/wN4rfyi4Sm7AEnKpiTsO7ZqRDsw0AhRk5H9Vo3a3ul+gkgeEnOuJoJ8/rTfwFo',
              "Content-Type": "application/json",
            },
          }
        );

        // Check if the API response is successful
        if (response.data.IsSuccess && response.data.CONSIGNMENT) {
          const { CNBODY } = response.data.CONSIGNMENT;

          if (CNBODY && CNBODY.CNACTION) {
            const actions = CNBODY.CNACTION;

            for (const action of actions) {
              const {
                strAction: current_status, // This will be stored in the 'strAction' column
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

              // Check if the status already exists for this lrNo
              const formattedDateTime = `${actionDate.slice(0, 2)}/${actionDate.slice(2, 4)}/${actionDate.slice(4)} ${actionTime.slice(0, 2)}:${actionTime.slice(2)}`; // Format: DD/MM/YYYY HH:MM
              const checkStatusSql = `
                SELECT COUNT(*) AS count 
                FROM tbl_dtdc_ltl_status 
                WHERE lrnum = ? AND strAction = ?`;
              const statusCheckResult = await mySqlQury(checkStatusSql, [lrNo, current_status]);
              const statusExists = statusCheckResult[0].count > 0;

              // If the status does not exist, insert it
              if (!statusExists) {
                const insertSql = `
                  INSERT INTO tbl_dtdc_ltl_status 
                  (lrnum, strAction, strManifestNo, strOrigin, strDestination, strActionDate, strActionTime, strVehicleNo, strDriverName, strDriverNo, strDocWeight, strMfMode, strAddress, strMobileNo, strEmailID, strRemarks, strAttempt, strError, date)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, NOW())`;
                const insertValues = [
                  lrNo,
                  current_status,
                  wbn,
                  origin,
                  destination,
                  formattedDateTime,
                  actionTime,
                  vehicleNo,
                  driverName || "", // Default to empty string if not provided
                  driverNo || "",   // Default to empty string if not provided
                  docWeight,
                  mfMode,
                  address,
                  mobileNo,
                  emailID,
                  remarks,
                  attempt || "",     // Default to empty string if not provided
                  error || "",       // Default to empty string if not provided
                ];
                await mySqlQury(insertSql, insertValues);
                console.log(`Data inserted for lrnum: ${lrNo} - ${current_status}`);
              } else {
                console.log(`Status '${current_status}' already exists for lrnum: ${lrNo}`);
              }
            }
          }
        } else {
          console.log(`No valid consignment data for lrnum: ${lrNo}`);
        }
      } catch (apiError) {
        // Log the API error and continue to the next lrNo
        console.error(`API error for lrnum ${lrNo}:`, apiError.message);
      }
    }
  } catch (error) {
    console.error("Error fetching lr_No:", error);
  }
};

module.exports = fetchAndUpdateDTDCStatus
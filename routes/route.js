const express = require('express');
const route = express.Router();
const { mySqlQury } = require('../middleware/db');
const {auth,ensureKYCApproved} = require('../middleware/auth')
const path = require('path');
const accessControlMiddleware = require('../middleware/accessControl');
const userController = require('../controller/userController');
const { uploadcv,clientdocs, uploadLR, uploadInvoice, upload,upload2 } = require('../middleware/multer');
route.get('/api/get-oda-charges',userController.apiGetOdaCharges) 
require('../crone/crone.js')
const axios = require('axios');
const { log } = require('console');


route.get("/verify", async (req, res) => {
  const { order_id } = req.query;
  if (!order_id) return res.status(400).send("Invalid link");

  try {
    // fetch order details to pre-fill
    const order = await ExpOrders.findOne({ where: { order_id } });

    res.render("verify-form", {
      order_id,
      order
    });
  } catch (err) {
    console.error("Verify form error:", err);
    res.status(500).send("Something went wrong");
  }
});


// GET: show form
route.get("/verify", async (req, res) => {
  const { order_id } = req.query;
  // (Optional) preload order details
  res.render("verify-form", { order_id });
});

// POST: save data
const { CustomerAddressUpdate } = require("../models");

route.post("/verify", async (req, res) => {
  const { order_id, name, email, phone, updated_address, updated_pincode } = req.body;

  try {
    await CustomerAddressUpdate.create({
      order_id,
      name,
      email,
      phone,
      updated_address,
      updated_pincode,
      status: "pending"
    });

    res.send(`<h3 style="text-align:center;margin-top:40px">✅ Thank you! Your details have been submitted.</h3>`);
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).send("❌ Something went wrong. Please try again later.");
  }
});


route.post("/api/send-whatsapp", userController.sendWhatsAppVerification);






route.post("/update-undel-reason", userController.addNdrReason);
route.get("/ndr-history", userController.getNdrHistory);




// ========== WHATSAPP ADDRESS VERIFICATION ========== //

// route.post("/api/send-address-verification", async (req, res) => {
//   try {
//     const { order_id } = req.body;

//     // 1. Fetch order details from DB
//     const order = await mySqlQury(
//       "SELECT order_id, consignee_name, consignee_phone, consignee_address, consignee_pincode FROM tbl_exp_orders WHERE order_id = ?",
//       [order_id]
//     );

//     if (!order || order.length === 0) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     const customer = order[0];

//     // 2. Build payload for Interakt
//     const payload = {
//       countryCode: "+91",
//       phoneNumber: customer.consignee_phone,
//       type: "Template",
//       template: {
//         name: "address_verification", // must match approved template in Interakt
//         languageCode: "en",
//         bodyValues: [
//           customer.consignee_name,
//           customer.consignee_address,
//           customer.consignee_pincode,
//           `https://yourdomain.com/verify?order_id=${customer.order_id}`
//         ]
//       }
//     };

//     // 3. Call Interakt API
//     const response = await axios.post(
//       "https://api.interakt.ai/v1/public/message/",
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.WHATS_APP_API}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     res.json({ success: true, data: response.data });
//   } catch (err) {
//     console.error("Error sending WhatsApp:", err.response?.data || err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });






// route.post("/api/update-address", async (req, res) => {
//   try {
//     const { order_id, new_address, new_pincode } = req.body;

//     await mySqlQury(
//       "UPDATE tbl_exp_orders SET corrected_address = ?, corrected_pincode = ? WHERE order_id = ?",
//       [new_address, new_pincode, order_id]
//     );

//     res.send("✅ Address updated successfully!");
//   } catch (err) {
//     console.error("Error updating address:", err.message);
//     res.status(500).send("❌ Failed to update address");
//   }
// });





route.post("/update-undel-reason", userController.addNdrReason);
route.get("/ndr-history", userController.getNdrHistory);

///======================NDR ROUTES==================================///
// route.post('/delivery-reattempt', userController.createReattempt);
route.get("/ndr-actions", userController.getNdrActions);
route.post('/delivery-reattempt', userController.createReattempt);

route.post('/rto-request', userController.createRto);

route.post('/escalation', userController.createEscalation);




route.get('/api/get-order-details', userController.getAllOrderDetails);







// ======================
// HELPDESK ROUTES
// ======================

// List admins for a given client_id

// Update ticket status by ticketId and new status
route.put('/api/support/tickets/:ticketId/status/:status', userController.updateSupportTicketStatus);

route.get('/api/support/overview', userController.getSupportTicketsWithAdmins);
route.get('/api/clients/:clientId/admins', userController.getAdminsByClientId);

route.get('/api/clients/:clientId/lr-nos', userController.getClientLRNumbers);
route.get('/support/categories', userController.getSupportCategories);
route.post('/api/support/tickets', userController.createTicket);
route.get('/helpdesk-reports', auth,userController.helpDeskReports)
route.get('/helpdesk-agents', auth, userController.helpdeskAgents)
route.get('/api/support/overview', userController.getSupportTicketsWithAdmins);





// ======================
// AUTHENTICATION ROUTES
// ======================      
route.get('/', userController.loginPage)
route.post('/', userController.loginAuth)
route.get('/signup', userController.getSignup)
route.post('/signup', userController.postSignup)
route.get('/verify/:token', userController.getVerifyToken)
route.get('/check-verification-status', userController.postCheckVerificationStatus)
route.post('/resend-verification', userController.postResendVerification)
route.get("/logout", auth, userController.lagout)

// ======================
// DASHBOARD ROUTES
// ======================
route.get('/index', auth, userController.index)
route.get('/api/order-summary', auth, userController.orderSummary)
route.get("/order-stats", userController.orderStats)
route.get("/order-stats", userController.getOrderStats)

// ======================
// ORDER MANAGEMENT
// ======================
// Order Creation
route.post('/create_order', upload.none(), auth, userController.postcreateOrder)
route.post('/create_order_single', upload.none(), auth, userController.createOrderSingle)
route.post('/create_order_multi', upload.none(), auth, userController.createOrderMulti)
route.post('/api/create-order-express', auth, userController.apiCreateOrderExpress)
route.post('/api/create-order-ecom', auth, userController.createOrderEcom)
route.post('/api/ecom/create-bulk-order', auth, uploadcv.any(), userController.createOrderEcomBulk)
route.post('/api/express/create-bulk-order', auth, uploadcv.any(), userController.createOrderExpressBulk)

route.get('/create-order-new', auth, userController.createOrderNew)

// Bulk Order Creation
route.get('/ltl/create-bulk-order', auth, userController.ltlCreateBulkOrder)
route.get('/ecom/create-bulk-order', auth, userController.ecomCreateBulkOrder)
route.get('/express/create-bulk-order', auth, userController.expressCreateBulkOrder)


// Order Tracking
route.get('/api/track-shipment', auth, accessControlMiddleware, userController.trackShipment)
route.get('/order_details/:orderNumber', auth, userController.orderDetailsOrderNumber)
route.get('/order-details/:order_id', auth, userController.orderDetailsOrderId)
route.get('/all_orders', auth, userController.getAllOrders)
route.get('/fetch-orders', auth, userController.fetchOrder)
route.delete('/delete-order', userController.deleteOrders)
route.post('/get-addresses/express', auth, userController.getAddressExpress)
// Order Status Categories
route.get('/ltl/unprocessed-orders', auth, userController.LtlUnprocessedOrder)
route.get('/ecom/unprocessed-orders', auth, userController.ecomUnprocessedOrder)
route.get('/express/unprocessed-orders', auth, userController.expressunprocessedOrder)
route.get('/ltl/ready_to_dispatch_assinged_lr', auth, userController.ltlReadyToDispatchLr)
route.get('/ecom/ready_to_dispatch_assinged_lr', auth, userController.ecomReadyToDispatch)
route.get('/express/ready_to_dispatch_assinged_lr', auth, userController.expressReadyToDispatch)
route.get('/ltl/order-in-transit', auth, userController.ltlOrderInTransit)
route.get('/ecom/order-in-transit', auth, userController.ecomOrderInTransit)
route.get('/express/order-in-transit', auth, userController.expressOrderInTransit)
route.get('/ltl/out-for-delivery', auth, userController.ltlOutForDelivery)
route.get('/express/out-for-delivery', auth, userController.expressOutForDelivery)
route.get('/ecom/out-for-delivery', auth, userController.ecomOutForDelivery)
route.get('/ltl/order-delivered', auth, userController.ltlOrderDelivered)
route.get('/express/order-delivered', auth, userController.expressOrderDelivered)
route.get('/ecom/order-delivered', auth, userController.ecomOrderDelivered)
route.get('/ltl/order-return', auth, userController.ltlOrderReturn)
route.get('/express/order-return', auth, userController.expressOrderReturn)
route.get('/ecom/order-return', auth, userController.ecomOrderReturn)
route.get('/ltl/cancelled-orders', auth, userController.ltlCancelledOrder)
route.get('/express/cancelled-orders', auth, userController.expressCancelledOrder)
route.get('/ecom/cancelled-orders', auth, userController.ecomCancelledOrder)
route.get('/order-dispatched', auth, userController.orderDispatch)

// Order Cancellation
route.post('/api/cancel-delhivery-standard', userController.apiCancelDelhiverystandard)
route.post('/api/cancel-delhivery-ltl', userController.apiCancelDelhiveryLtl)
route.post('/api/cancel-dtdc-standard', userController.apiCancelDtdcStandard)
route.post('/api/cancel-expressbees-standard', userController.apiCancelExpressbeesStandard)

// ======================
// SHIPPING & LABELS
// ======================
route.get('/get-shipping-label', auth, userController.getShippingLabel)
route.get('/api/shipping-label/delhivery-ltl', auth, userController.shippingLabelDelhiveryLtl)
route.post('/api/print-bulk-labels', auth, userController.printBulkLabels)
route.get('/delivery-shipping-label-links', userController.delhiveryShipingLabelLinks)
route.get('/delhivery-standard-label', userController.delhiveryStandardLabel)

// ======================
// LR (LOAD RECEIPT) MANAGEMENT
// ======================
route.post('/create_lr', auth, upload.any(), userController.createLr)
route.post('/create_lr/api', upload.any(), userController.createLrApi)
route.post('/save_bulk_lr_automatic', auth, userController.saveBulkLrAutomatic)
route.post("/create_bulk_lr_manual", auth, userController.createBulkLrManual)
route.get('/get-manual-lr', auth, userController.getManualLr)
route.get('/mannual-lr-vault', auth, userController.mannualLrVault)
// route.post('/upload-lr-data', uploadLR.single('lrDataFile'), userController.postUploadLrData)
route.get('/filter-lrs', auth, userController.getFilterLrs)

// ======================
// TRACKING ROUTES
// ======================
route.get('/delivery-status/:lrNo', auth, userController.deliveryStatusLrno)
route.get('/delivery-standard-status/:lrNo', auth, userController.deliveryStandStatusLr)
route.get('/dtdc-ltl-status/:lrNo', auth, userController.dtdcLtlStatusLr)
route.get('/dtdc-standard-status/:lrNo', auth, userController.dtdcStandardStatusLr)
route.get('/expressbees-std/:lrNo', auth, userController.expressbeesStdLrno)
route.get('/tracking-master', auth, userController.trackingMaster)

// ======================
// WAREHOUSE MANAGEMENT
// ======================
route.get('/warehouse', auth, userController.warehouse)
route.post('/add_warehouse', auth, userController.addWarehouse)
route.get('/api/warehouses/:id', userController.getapiWarehouseId)
route.put('/api/warehouses/:id', auth, userController.putapiWarehouseId)
route.get('/get_warehouse_addresses', auth, userController.getWarehouseAddress)
route.get('/get-warehouses-by-client/ecom',auth, userController.getWarehousebyClientEcom)
route.get('/get-warehouses-by-client/express',auth, userController.getWarehousebyClientExpress)
route.get('/predispatch/api/location/:id', auth, userController.preDispatchapiLocationId)
route.get('/api/location/:id', auth, userController.apiLocationId)

// ======================
// PINCODE SERVICES
// ======================
route.post('/validate-pincode', userController.validatePincode)
route.post('/validate-pincode-master', userController.validatePincodeMaster)
route.get('/delivery/pincode-check', auth, userController.delhiveryPincodeCheck)
route.get('/delivery_ltl/pincode-check', auth, userController.deliveryLtlPincodeCheck)
route.get('/expressbees/pincode-check', auth, userController.expressbeesPincodeCheck)
route.get('/dtdc/pincode-check', auth, userController.dtdcPincodeCheck)
route.get('/master-pincode', auth, userController.getMasterPincode)
route.post('/api/master-pincode', userController.apiMasterPincode)

// ======================
// CLIENT MANAGEMENT
// ======================
route.get('/client-management', auth, userController.clientManagement)
route.get('/client-onboarding', auth, userController.getClientOnboarding)
route.get('/client-list', auth, userController.getClientList)
route.delete('/delete-client/:id', auth, userController.deleteClientId)
route.get('/api/client/:id', auth, userController.apiClientId)
route.delete('/api/client/:id', auth, userController.deleteapiClientId)
route.put('/api/client/:id/parental', upload.single('companyLogo'), auth, userController.apiClientIdParental)
route.put('/api/client/:id/departmental', auth, upload.single('companyLogo'), userController.apiClientIdDepartmental)
route.put('/api/clients/vas', userController.apiClientVas)
route.get('/api/client-gst-number', auth, userController.apiClientGstNumber)
route.get('/choose-user', auth, userController.chooseUser)
route.get('/choose-clientComp/:clientId', auth, userController.chooseClientCompClientId)
route.post('/new_client', auth, upload.any(), userController.newClient)
route.post('/predispatch/client_sign_in', auth, upload.any(), userController.preDispatchClientSignIn)

// ======================
// KYC MANAGEMENT
// ======================
route.get('/kyc', auth, userController.postKyc)
route.post('/submit-kyc', auth, clientdocs, userController.postSubmitKyc)
route.post('/approve-client-kyc', userController.postApproveClientKyc)
route.get('/kyc-list', auth, ensureKYCApproved, userController.getKycList)
route.post('/kyc/verify', auth, userController.postKycVerify)
route.post('/client-kyc-verification', auth, userController.postClientKycVerification)
route.post('/client-gstin-verification', auth, userController.postClientGstinVerification)

// ======================
// FORWARDER/COURIER MANAGEMENT
// ======================
route.get('/forwarder-onboarding', auth,accessControlMiddleware, userController.getforwarderOnboarding)
route.get('/forwarder-list', auth, userController.getforwarderList)
route.get('/forwarder_onboarding', auth, userController.forwarderOnboarding)
route.post('/predispatch/forwarder_onboarding', auth, upload.any(), userController.predispatchForwarderOnboarding)
route.post('/api/forwarder/onboard/ltl', auth, upload.any(), userController.apiForwarderOnboardLtl)
route.post('/api/forwarder/onboard/express', auth, upload.any(), userController.apiForwarderOnboardExpress)
route.post('/api/forwarder/onboard/ecom', auth, upload.any(), userController.apiForwarderOnboardEcom)
route.post('/predispatch/forwarder_onboarding_stand', auth, upload.any(), userController.predispatchforOnboardingStand)
route.get('/get-forwarders', userController.getForwarders)
route.post('/get_forwarder_details', userController.postgetForwarderDetails)
route.post('/api/bulk-forwarding-partners', auth, userController.apiBulkForwardingPartners)
route.get('/api/forwarding-partners', auth, userController.apiForwardingPartners)
route.get('/api/courier/:id', userController.apiCourierId)
route.put('/api/courier/:id', auth, upload.any(), userController.putapiCourierId)
route.delete('/courier/delete/:id', auth, userController.postCourierDeleteId)
route.post('/forwarder_update/:forwarderId', userController.postForwarderUpdate)

// Forwarder Contacts
route.get('/api/forwarder/contacts/:id', userController.forwarderContactsId)
route.put('/api/forwarder/contacts/:id', userController.putapiforContactsId)

// Forwarder Charges
route.get('/api/forwarder/charges/:id', userController.apiforChargesId)
route.get('/api/express/add-charges/:id', userController.apiExpressAddchargeId)
route.get('/api/forwarder/unified-data/:id', userController.apiForwarderUnifiedData)
route.put('/api/courier/charges/:id', userController.apiCourierChargeId)

// ======================
// AGGREGATOR MANAGEMENT
// ======================
route.get('/aggrigator-onboarding', auth, userController.aggrigatorOnboarding)
route.post('/predispatch/Aggrigator_onboarding', auth, upload.any(), userController.predispatchAggrigatorOnboarding)
route.post("/predispatch/Aggrigator_onboarding_std", auth, upload.any(), userController.predispatchAggOnStd)
route.get('/aggrigator-list', auth, userController.getAggrigatorList)
// route.get('/aggrigator-list', auth, userController.getaggritorList)
route.get('/aggrigator-by-client/:clientId', auth, userController.getAggByClientId)
route.get('/api/aggrigator/:id', userController.getapiAggrigatorId)
route.put('/api/aggrigator/:id', auth, upload.any(), userController.putapiAggrigatorId)
route.delete('/api/aggrigator/:id', auth, userController.apiAggrigatorId)
route.post('/save-agg-to-client', auth, userController.postSaveAggToClient)
route.post('/aggrigator/update-status', auth, upload.any(), userController.postAggUpdateStatus)
route.post('/aggrigator/upload-pincode-csv', auth, upload.any(), userController.postAggUploadPincode)
route.post('/api/aggregator/toggle-recommendation', auth, userController.postAggToggleRecommendation)
route.get('/api/package/express-rate-list/:courierId', auth, userController.apiPackageExpressRateList)
route.get('/api/package/ecom-rate-list/:courierId', auth, userController.apiPackageEcomRateList)

// ======================
// RATE MANAGEMENT
// ======================
route.get('/api/calculate-express-rate', auth, userController.apiCalculateExpressRate)
route.get('/api/calculate-ecom-rate', auth, userController.apiCalculateEcomRate)
route.get('/api/standard-tat/:vendorId', userController.apiStandardTatVendorId)
route.post('/api/standard-tat/save', userController.apiStandardTatSave)
route.get('/api/standard-zone-mapping/:vendorId', userController.apiStandardZoneMapVendor)
route.post('/api/standard-zone-mapping/save', userController.apiStandardZoneMapSave)
route.get('/api/ltl-zone-mapping/:vendorId', userController.apiLtlZoneMapVendorId)
route.post('/api/ltl-zone-mapping/save', userController.apiLtlZoneMapSave)
route.get('/api/vendor-rate-list/ltl/:vendorId', userController.apiVendorRateListLtlVendorId)
route.get('/api/ltl-rate-list/:courierId', userController.apiLtlRateListCourierId)
route.get('/api/express-rate-list/:courierId', userController.apiExpressRateListCourierId)
route.put('/api/express-rate-list/:courierId', userController.apiputExpressrateCourierId)
route.get('/api/vendor-tat/ltl/:vendorId', userController.apiVendorTatLtl)
route.post('/api/vendor-tat/ltl/save', userController.apiVendorTatLtlSave)
route.post('/api/vendor-rate-list/ltl/save', userController.apiVendorRateListLtl)
route.get('/api/standard-rate-list/:vendorId', userController.getapiStandardRateList)
route.post('/api/standard-rate-list/:vendorId', userController.postapiStandardRateList)

// ======================
// BILLING & COD ROUTES
// ======================
route.get('/billing-reports', auth, userController.billingReport)
route.get('/billingDateFilter', userController.billingDataFilter)
route.get('/billingDateFilterForDonloadCSV', userController.billingDateFilterForDonloadCSV)
route.get('/downloadOldInvoiceCSV', userController.downloadOldInvoiceCSV)
route.get('/cod-dashboard', auth, userController.getCodDashboard)
route.get('/cod-summary', auth, userController.getCodSummary)
route.post("/upload-remittance", upload2.single("file"), userController.postUploadRemittance)
route.get('/get-utr-data', userController.getUtrData)
route.get('/bank-reconsilation', auth, userController.getBankReconsilation)
route.get('/to-be-remitted', auth, userController.getToBeRemitted)
route.get('/remitted', auth, userController.getRemitted)
route.get('/billclientdata', auth, userController.billclientdata)

// ======================
// WALLET MANAGEMENT
// ======================
route.get("/check-wallet-amount", userController.chekWalletAmount)
route.post("/update-wallet", userController.updateWallet)
route.get('/domestic-wallet', auth, userController.domesticWallet)
route.post('/api/phonepay/initiate-payment', auth, userController.apiPhonepayInitiatePayment)
route.get('/api/phonepay/callback/:userId/:merchantOrderId', userController.apiPhonepayMerchantOrderId)
route.post('/api/whatsapp/initiate-payment', auth, userController.apiWhatsappInitiatePayment)
route.get('/api/whatsapp/callback/:userId/:merchantOrderId', userController.apiWhatsappUseridMerchantOrderId)

// ======================
// USER MANAGEMENT
// ======================
route.get('/user-management', auth,accessControlMiddleware,  userController.userManagement)
route.get('/admin/view/:id', userController.adminViewId)
route.post('/admin/edit', upload.any(), userController.adminEdit)
route.post('/admin/deactivate', userController.adminDeactivate)
route.get('/permission-management', auth, userController.permissionManagement)
route.post('/permission_control', userController.permissionControl)
route.get('/api/getReportingUsers/:clientId', userController.apiGetReportingUsersClientId)
route.get('/api/getReportingUsers/:clientId', userController.apigetReportingUserClientid)

// ======================
// ROLE MANAGEMENT
// ======================
route.get('/role-management', auth, accessControlMiddleware, userController.getRoleManagement)
route.get('/manage-role', auth, accessControlMiddleware, userController.getManageRole)
route.post('/api/roles', auth, accessControlMiddleware, userController.postApiRoles)
route.patch('/api/roles/:id', auth, accessControlMiddleware, userController.patchApiRolesid)
route.delete('/api/roles/:id', auth, accessControlMiddleware, userController.deleteApiRolesId)

// ======================
// REPORTS
// ======================
route.get('/awb-report', auth, userController.getMasterDocket)
route.get('/custom-report', auth, userController.getCustomReport)
route.get('/master-docket', auth, userController.getMasterDocket2)
route.get('/cod-reports', auth, userController.codReports)
route.post('/get-orders-rto', auth, userController.getOrdersRto)
// route.post('/getOrders', auth, userController.getOrders)
route.get("/download-excel", userController.downloadExcel)
// Delete aggregator route


route.post('/api/logistic-partner/ecom', async (req, res) => {
  const { global_additional_charges, slab_inputs, volumetric_factor, courier_id, noOfShipment } = req.body;
  console.log("jdhsjdhsjreq body",req.body)
  console.log("global_additional_charges jhajd", global_additional_charges);
  const nestedSlabs = unflattenSlabInputs(slab_inputs);
  console.log("business_volume", noOfShipment);


  console.log(JSON.stringify(nestedSlabs, null, 2));
  const zoneRateAndslabAdd = nestedSlabs; // Use as object, not string
  console.log("volumetric_factorsas", volumetric_factor);
  console.log("courier_idsas", courier_id);
  

  // Start MySQL transaction
  await mySqlQury('START TRANSACTION');
  try {
    // 1. Get the courier name and tagged_api from tbl_courier_details
    const courierRows = await mySqlQury(
      'SELECT company_name, Tagged_api FROM tbl_courier_details WHERE id = ?',
      [courier_id]
    );
    if (!courierRows || courierRows.length === 0) {
      await mySqlQury('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Invalid courier_id' });
    }
    const lp_name = courierRows[0].company_name;
    const tagged_api = courierRows[0].Tagged_api;

    // 2. Insert into tbl_logistics_partner
    const result = await mySqlQury(
      `INSERT INTO tbl_logistics_partner 
        (tagged_api, courier_id, volumetric_factor, packet_shipment, name, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [tagged_api, courier_id, volumetric_factor, noOfShipment, lp_name]
    );
    console.log("resulty in the ecom",result)
    const lp_id = result.insertId;

    // 3. Insert global_additional_charges into tbl_exp_lp_additional_charges
    if (Array.isArray(global_additional_charges)) {
      for (const charge of global_additional_charges) {
        const {
          charge_name,
          calculation_based_on_min,
          min_value,
          calculation_based_on_max,
          max_value,
          condition_based,
          chargable_value_type
        } = charge;

        await mySqlQury(
          `INSERT INTO tbl_ecom_lp_additional_charges 
            (lp_id, charge_name, calculation_based_on_min, calculation_based_on_max, min_value, max_value, condition_based, chargable_value_type, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            lp_id,
            charge_name || null,
            calculation_based_on_min || null,
            calculation_based_on_max || null,
            min_value || null,
            max_value || null,
            condition_based || null,
            chargable_value_type || null
          ]
        );
      }
    }

    // 4. Insert zones_input into tbl_exp_lp_zones_rates
    if (zoneRateAndslabAdd && Array.isArray(zoneRateAndslabAdd.slabs)) {
      for (const slab of zoneRateAndslabAdd.slabs) {
        if (slab && slab.zones_input) {
          for (const [zone_name, zone_value] of Object.entries(slab.zones_input)) {
            await mySqlQury(
              `INSERT INTO tbl_ecom_lp_zones_rates (lp_id, zone_name, zone_value, created_at, updated_at)
               VALUES (?, ?, ?, NOW(), NOW())`,
              [lp_id, zone_name, zone_value]
            );
          }
        }
      }
    }

    // 5. Insert slab_additional into tbl_exp_lp_slab_add_charges
    if (zoneRateAndslabAdd && Array.isArray(zoneRateAndslabAdd.slabs)) {
      for (const slab of zoneRateAndslabAdd.slabs) {
        if (slab && Array.isArray(slab.slab_additional)) {
          for (const addObj of slab.slab_additional) {
            if (addObj && addObj.input) {
              for (const [zone_name, amount] of Object.entries(addObj.input)) {
                await mySqlQury(
                  `INSERT INTO tbl_ecom_lp_slab_add_charges (lp_id, zone_name, amount, created_at, updated_at)
                   VALUES (?, ?, ?, NOW(), NOW())`,
                  [lp_id, zone_name, amount]
                );
              }
            }
          }
        }
      }
    }

    // Commit transaction if all is well
    await mySqlQury('COMMIT');
    res.json({ success: true, message: "Express onboarding saved!", id: lp_id });
  } catch (err) {
    console.error(err);

    // Rollback transaction on error
    await mySqlQury('ROLLBACK');

    // Send error message to UI if available, else generic
    let errorMessage = "Server error";
    if (err && err.message) {
      errorMessage = err.message;
    }
    res.status(500).json({ success: false, message: errorMessage });
  }
});
function unflattenSlabInputs(flat) {
  const result = { slabs: [] };
  for (const key in flat) {
    const value = flat[key];
    // slabs[0][zones_input][A]
    let match = key.match(/^slabs\[(\d+)\]\[([^\]]+)\]\[([^\]]+)\]$/);
    if (match) {
      const [_, slabIdx, group, subkey] = match;
      if (!result.slabs[slabIdx]) result.slabs[slabIdx] = {};
      if (!result.slabs[slabIdx][group]) result.slabs[slabIdx][group] = {};
      // Convert value to number if possible
      const num = Number(value);
      result.slabs[slabIdx][group][subkey] = isNaN(num) ? value : num;
      continue;
    }
    // slabs[0][slab_additional][0][input][A]
    match = key.match(/^slabs\[(\d+)\]\[slab_additional\]\[(\d+)\]\[([^\]]+)\]\[([^\]]+)\]$/);
    if (match) {
      const [_, slabIdx, addIdx, inputType, subkey] = match;
      if (!result.slabs[slabIdx]) result.slabs[slabIdx] = {};
      if (!result.slabs[slabIdx].slab_additional) result.slabs[slabIdx].slab_additional = [];
      if (!result.slabs[slabIdx].slab_additional[addIdx]) result.slabs[slabIdx].slab_additional[addIdx] = {};
      if (!result.slabs[slabIdx].slab_additional[addIdx][inputType]) result.slabs[slabIdx].slab_additional[addIdx][inputType] = {};
      const num = Number(value);
      result.slabs[slabIdx].slab_additional[addIdx][inputType][subkey] = isNaN(num) ? value : num;
    }
  }
  return result;
}


// ======================
// API INTEGRATIONS
// ======================
route.get('/api-integration', auth, userController.apiIntegration)
route.get('/api-token-for-expressbees', auth, userController.apiTokenForExpressbees)
route.get('/api-token-for-delhivery', userController.apiTokenForDelhivery)
route.get('/get-api-token', auth, userController.getApiToken)
route.post('/call-delhivery-api', auth, uploadInvoice.any(), userController.callDeliveryapi)
route.post('/woocommerce-data', userController.postWoocommereData)
route.post('/api/logistic-partner/express', userController.apiLogisticPartnerExpress)
route.post('/api/onboarding/ecom', userController.apiOnboardingEcom)
route.post('/api/delhivery-create-order', userController.apiDelhiveryCreateOrder)
route.post('/api/expressbees-create-order', auth, userController.expressCreateOrder)
route.post('/api/expressbees-create-order-ecom', auth, userController.expressBeesCreateOrderEcom)
route.post('/api/delhivery-create-order-ecom', auth, userController.delhiveryCreateOrderEcom)
route.get('/ecom/shop-integration', auth, userController.eshopIntegration)
route.post('/api/shopify/connect',auth,userController.eshopIntegrationDataSave)

// ======================
// CHAT & WHATSAPP
// ======================
route.get('/chat-ui', auth, userController.getchatUi)
route.get('/chat-ui-setting', auth, userController.getChatUiSetting)
route.post('/api/whatsapp/subscribe', auth, userController.postapiWhatsappSubs)
route.post('/api/whatsapp/update-status', auth, userController.postapiUpdateStatus)
route.post('/api/whatsapp/toggle-activation', auth, userController.postapiWhatsappToggleActvation)
route.get('/api/customers/:customer_phone/:clientId/orders', userController.getapiCustomerPhoneOrders)
route.get('/api/orders/:orderId/:clientId/messages', userController.apiOrdersClientMassage)
route.post('/api/messages', userController.postapiMassages)

// ======================
// MISC ROUTES
// ======================
route.get('/test-route', (req, res) => {
  res.json({ message: 'Route is working!' })
})
route.get('/get-po/:poNo', auth, userController.getPo)
route.get('/getTaggedApi', userController.getTaggedApi)
route.get('/sellerDetails/:client_id',auth, userController.sellerDetailsClientId)
route.post('/api/update-order-status', userController.apiUpdateOrderStatus)
route.get('/helpdesk-tickets', auth, userController.helpdeskTickets)
route.get('/get-pickhub-code', userController.getPickupCode)
route.get('/api/box-dimensions/:ref_number', userController.apiBoxDimensionREfNumber)
route.get('/api/box-dimensions-ecom/:ref_number', userController.apiBoxDimensionREfNumberEcom)
route.get('/fetch-volumetric-data', userController.fetchVloumetricData)
route.get('/get_aggrigator_details', auth, userController.getAggrigatorDetails)
route.get('/get-aggregators/:clientId', auth, userController.getAggrigatorClientId)
route.get('/api/aggrigator-partners/pincode', auth, userController.apiAggrigatorPartnersPincode)
route.get('/api/clients', auth, userController.apiClients)
route.post('/api/client-products', auth, userController.postapiClientOrder)
route.post('/get-addresses/ecom', auth, userController.getAddressesEcom)

route.post('/api/get-forwarder-options', auth, userController.apigetForwarderOptions)
route.get('/predispatch/edit/:id', auth, userController.predispatchEditId)
route.post('/update-return-status', auth, userController.postUpdateReturnStatus)
route.post('/update-pickup-status', auth, userController.updatePickupStatus)
route.post('/predispatch/getCitiesAndUpdateStates', userController.postpredispatchGetcitiesAndUpdateStatus)
route.post('/predispatch/getStatesBasedOnCities', userController.postpreStateBasedOnClients)
route.get("/getCities", auth, userController.getCities)
route.post('/upload-excel', uploadLR.any(), userController.postUploadExcel)

// ======================
// SERVICE TYPE ROUTES
// ======================
route.get('/ltl', userController.getLtl)
route.get('/express', auth, userController.getExpress)
route.get('/ecom', auth, userController.getEcom)
route.get('/ltl/create-order', userController.getLtlCreateOrder)
route.get('/express/create-order', auth, userController.getExpressCreateOrder)
route.get('/ecom/create-order', auth, userController.getEcomCreateOrder)

// /api/clients
route.get('/api/all-clients', auth, async (req, res) => {
  const { id: currentUserId } = req.user;

  try {
    const query = `
      WITH RECURSIVE nested_users AS (
        -- 1) seed with the current user
        SELECT
          id,
          parent_id,
          level,
          CONCAT_WS(' ', NULLIF(first_name, ''), NULLIF(last_name, '')) AS full_name,
          company_name,
          email,
          country_code,
          phone_no
        FROM tbl_admin
        WHERE id = ?

        UNION ALL

        -- 2) include all descendants (levels 2 & 3)
        SELECT
          a.id,
          a.parent_id,
          a.level,
          CONCAT_WS(' ', NULLIF(a.first_name, ''), NULLIF(a.last_name, '')) AS full_name,
          a.company_name,
          a.email,
          a.country_code,
          a.phone_no
        FROM tbl_admin a
        INNER JOIN nested_users nu ON a.parent_id = nu.id
        WHERE a.level IN (2, 3)
      )
      -- 3) final selection (dedup just in case) 
      SELECT DISTINCT
        id,
        parent_id,
        level,
        full_name,
        company_name,
        email,
        country_code,
        phone_no
      FROM nested_users
      ORDER BY level, company_name, full_name;
    `;

    const clients = await mySqlQury(query, [currentUserId]);

    res.json({ clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});


 
// /api/clients/:clientId/users
route.get('/api/clients/:clientId/users', auth, async (req, res) => {
  const { clientId } = req.params;

  try {
    const query = `
      SELECT id, parent_id, level,
             CONCAT(first_name, ' ', last_name) AS full_name
      FROM tbl_admin
      WHERE parent_id = ? 
        AND level = 4
    `;

    const users = await mySqlQury(query, [clientId]);
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


route.get('/calculator', (req, res) => {
  // Assuming req.user.role or req.session.role contains the user's role
  // Adjust as per your authentication/session implementation
  const role = req.user?.role || req.session?.role || null;

  res.render('pages/calculator', {
    bodyClass: 'profile-page',
    activePage: 'profile',
    title: 'Client List',
    role: role
  });
});
route.get('/express/package', auth, async (req, res) => {
  try {
    const clients = await mySqlQury(`SELECT id, company_name FROM tbl_new_client`);
    res.render('pages/express/package', {
      title: 'Client Package Manager',
      bodyClass: 'profile-page',
      activePage: 'client-package',
      role: req.user.role,
      level: req.user.level,
      clientList: clients // <-- send as array, not JSON.stringify(clients)
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading packages');
  }
});
route.get('/ecom/package', auth, async (req, res) => {
  try {
    const clients = await mySqlQury(`SELECT id, company_name FROM tbl_new_client`);
    res.render('pages/ecom/package', {
      title: 'Client Package Manager',
      bodyClass: 'profile-page',
      activePage: 'client-package',
      role: req.user.role,
      clientList: clients // <-- send as array, not JSON.stringify(clients)
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading packages');
  }
});
const getPlanName = (volumeId) => {
  const map = {
    1: 'basic',
    2: 'basic-lite',
    3: 'lite-pro',
    4: 'premium',
    5: 'advance',
    6: 'advance-pro',
    7: 'enterprise'
  };
  return map[volumeId] || 'basic';
};

const getPlanNameEcom = (packetShipmentId) => {
  const map = {
    1: '0 - 500 Shipment',
    2: '500 - 1000 Shipment',
    3: '1000 - 1500 Shipment',
    4: '1500 - 2000 Shipment',
    5: '2000 - 2500 Shipment',
    6: '2500 - 3000 Shipment',
    7: '3000 - 3500 Shipment',
    8: '3500 - 4000 Shipment',
    9: '4000 Above'
  };
  return map[packetShipmentId] || '0 - 500 Shipment';
};
// GET /package/client/:id?   (id optional; only used by Super Admin)
route.get('/package/client/:_ignored?', auth, async (req, res) => {
  try {
    const targetClientId = Number(req.user?.selectedClientId);

    if (!Number.isInteger(targetClientId) || targetClientId <= 0) {
      return res.status(400).json({ error: 'Invalid selected client id.' });
    }

    const sql = `
    SELECT 
      lp.id AS aggrigator_id,
      lp.name AS courier_name,
      lp.aggrigator_type,
      lp.status,
      lp.business_volume,
      clp.status AS assigned_status,
      clp.recommended,
      c.tagged_api,
      c.delhivery_api_variant
    FROM tbl_client_lp clp
    JOIN tbl_logistics_partner lp 
      ON lp.id = clp.logictics_partner_id
    JOIN tbl_courier_details c 
      ON lp.courier_id = c.id 
     AND c.courier_type = 'express'
    WHERE clp.client_id = ?
  `;
  

  

    const result = await mySqlQury(sql, [targetClientId]);
    console.log("result",result)

    const onePackages = [];
    const customPackages = [];
    const courierData = {};

    for (const row of result) {
      const isOnePackage = row.aggrigator_type === 1;
      const planName = isOnePackage ? getPlanName(row.business_volume) : 'custom';

      if (!courierData[planName]) courierData[planName] = [];
      courierData[planName].push({
        name: row.courier_name,
        active: row.assigned_status == 1,
        client_id: targetClientId,
        aggrigator_id: row.aggrigator_id,
        recommended: row.recommended == 1,
        tagged_api: row.tagged_api,
        delhivery_api_variant: row.delhivery_api_variant
      });

      if (isOnePackage) {
        if (!onePackages.includes(planName)) onePackages.push(planName);
      } else {
        if (!customPackages.includes(planName)) customPackages.push(planName);
      }
    }

    return res.json({ onePackages, customPackages, courierData });
  } catch (err) {
    console.error('Error loading client package data:', err);
    return res.status(500).json({ error: 'Error loading client package data' });
  }
});

// Ecom package route for packet shipments
route.get('/ecom/package/client/:_ignored?', auth, async (req, res) => {
  try {
    const targetClientId = Number(req.user?.selectedClientId);

    if (!Number.isInteger(targetClientId) || targetClientId <= 0) {
      return res.status(400).json({ error: 'Invalid selected client id.' });
    }

    const sql = `
    SELECT 
      lp.id AS aggrigator_id,
      lp.name AS courier_name,
      lp.aggrigator_type,
      lp.status,
      lp.packet_shipment,
      clp.status AS assigned_status,
      clp.recommended,
      c.tagged_api,
      c.delhivery_api_variant
    FROM tbl_client_lp clp
    JOIN tbl_logistics_partner lp 
      ON lp.id = clp.logictics_partner_id
    JOIN tbl_courier_details c 
      ON lp.courier_id = c.id 
     AND c.courier_type = 'ecom'
    WHERE clp.client_id = ?
  `;
  
  

    const result = await mySqlQury(sql, [targetClientId]);
    // console.log("result",result)

    const onePackages = [];
    const customPackages = [];
    const courierData = {};

    for (const row of result) {
      const isOnePackage = row.aggrigator_type === 1;
      const planName = isOnePackage ? getPlanNameEcom(row.packet_shipment) : 'custom';

      if (!courierData[planName]) courierData[planName] = [];
      courierData[planName].push({
        name: row.courier_name,
        active: row.assigned_status == 1,
        client_id: targetClientId,
        aggrigator_id: row.aggrigator_id,
        recommended: row.recommended == 1,
        tagged_api: row.tagged_api,
        delhivery_api_variant: row.delhivery_api_variant
      });

      if (isOnePackage) {
        if (!onePackages.includes(planName)) onePackages.push(planName);
      } else {
        if (!customPackages.includes(planName)) customPackages.push(planName);
      }
    }

    return res.json({ onePackages, customPackages, courierData });
  } catch (err) {
    console.error('Error loading ecom package data:', err);
    return res.status(500).json({ error: 'Error loading ecom package data' });
  }
});

// EDIT 
route.post('/api/courier/toggle', auth, async (req, res) => {
  try {
    const { client_id, aggrigator_id, active } = req.body;
    // Only allow superadmin (role 1)
    if (req.user.role !== 1) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    await mySqlQury(
      `UPDATE tbl_client_lp 
       SET status = ?, disable_by_superadmin = ? 
       WHERE client_id = ? AND logictics_partner_id = ?`,
      [active ? 1 : 0, active ? 0 : 1, client_id, aggrigator_id]
      // If active is 1, disable_by_superadmin is 0; if active is 0, disable_by_superadmin is 1
    );
    res.json({ success: true, message: 'Status and disable_by_superadmin updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
});
// Dashboard

// Status mapping for tbl_exp_lr
const statusMap = {
  0: "Cancelled",
  1: "RTD",
  2: "Picked Up",
  3: "In Transit",
  4: "Delivered",
  5: "RTO",
  7: "NDR",
  8: "Out for Delivery",
};

//logiitics partner this is the logistics which has package data

//express aggrigator/logistics/partner-rate-list
route.get('/api/express-lp-rate-list/:clientid/:logisticsId', async (req, res) => {
  try {
    const logisticsId = req.params.logisticsId;
    const clientId = req.params.clientid
    console.log("shabbar raza ansari",logisticsId,clientId);
    // console.log("jsdhjsdhsjd",dsjdjsd)
    // const courierId = 35;

    const [courierDetails] = await mySqlQury(
  `SELECT
     c.id AS courierId,
     lp.volumetric_factor,
     lp.parent_lp_id
   FROM tbl_logistics_partner lp
   LEFT JOIN tbl_courier_details c 
     ON lp.courier_id = c.id
   WHERE lp.id = ?
     AND c.courier_type = 'express'`,
  [logisticsId]
);

    console.log("skdhsjkdhs",courierDetails)
    const volumetric_factor = courierDetails ? courierDetails.volumetric_factor : null;

    // 1. Get all weight slabs for this courier
    const slabs = await mySqlQury(`
      SELECT slab_id, min_weight, max_weight, unit
      FROM tbl_exp_weightslabs
      WHERE courier_id = ?
    `, [courierDetails.courierId]);

    const formattedSlabs = [];
    console.log("slabs id",slabs)

    for (const slab of slabs) {
      const { slab_id: slabId, min_weight, max_weight, unit } = slab;

      // 2. Get zone rates for this weight slab
      const zoneRates = await mySqlQury(`
        SELECT zone_name, zone_value
        FROM tbl_exp_lp_zones_rates
        WHERE lp_id = ?
      `, [logisticsId]);

      const zones = {};
      zoneRates.forEach(rate => {
        zones[rate.zone_name] = parseFloat(rate.zone_value);
      });

   

     // Use the helper
  const slab_additional_charges = await getSlabAdditionalCharges({
    lpId: logisticsId,
    courierId: courierDetails.courierId,
    slabId
  });

      // 4. Push formatted slab
      formattedSlabs.push({
        min_weight,
        max_weight,
        unit,
        zones,
        slab_additional_charges
      });
    }

    // 5. Get global express additional charges
    const expressAdditionalCharges = await mySqlQury(`
      SELECT charge_id, charge_name, calculation_based_on_min, calculation_based_on_max, min_value, max_value, condition_based, chargable_value_type
      FROM tbl_exp_lp_additional_charges
      WHERE lp_id = ?
    `, [logisticsId]);

    res.json({
      slabs: formattedSlabs,
      express_additional_charges: expressAdditionalCharges,
      volumetric_factor

    });

  } catch (error) {
    console.error('Error fetching express rate list:', error);
    res.status(500).json({ error: 'Failed to fetch express rate list' });
  }
});
// Create/Update Express LP Rate List (POST for create, PUT for update)
route.post('/api/copy/express-lp-rate-list/:logisticsId/:clientId', auth, async (req, res) => {
  try {
    const { logisticsId, clientId } = req.params;
    console.log("req body",req.body)

    const {
      global_additional_charges = [],
      slab_inputs = {},
      volumetric_factor,
      business_volume,
    } = req.body;
    // console.log("jdgsjhdgshd",dsgdhsgdh)


    const nestedSlabs = unflattenSlabInputs(slab_inputs);
    const zoneRateAndslabAdd = nestedSlabs;
    console.log("zoneRateAnd slab",zoneRateAndslabAdd.slabs)

    // Start MySQL transaction
    await mySqlQury('START TRANSACTION');

    // 1. Get courier name and tagged_api from tbl_courier_details
    const [courierRows] = await mySqlQury(
      'SELECT * FROM tbl_logistics_partner WHERE id = ?',
      [logisticsId]
    );
    console.log("courier details",courierRows)
    if (!courierRows || courierRows.length === 0) {
      await mySqlQury('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Invalid courier_id' });
    }

    const lp_name = courierRows.name;
    const tagged_api = courierRows.tagged_api;
    const courier_id = courierRows.courier_id;
    // console.log("ghsaghgdhga",hdghsd)

    // 2. Insert new logistics partner (aggregator)
    const result = await mySqlQury(
      `INSERT INTO tbl_logistics_partner
        (tagged_api, courier_id, volumetric_factor, name, aggrigator_type,created_at, updated_at,parent_lp_id)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW(),?)`,
      [tagged_api, courier_id, volumetric_factor, lp_name,0,logisticsId]
    );
    const lp_id = result.insertId;

    // 3. Insert into tbl_client_lp
    await mySqlQury(
      `INSERT INTO tbl_client_lp (client_id, logictics_partner_id, status, disable_by_superadmin, recommended)
       VALUES (?, ?, 1, 0, 0)`,
      [clientId, lp_id]
    );

    // 4. Insert global_additional_charges
    if (Array.isArray(global_additional_charges)) {
      for (const charge of global_additional_charges) {
        const {
          charge_name,
          calculation_based_on_min,
          min_value,
          calculation_based_on_max,
          max_value,
          condition_based,
          chargable_value_type
        } = charge;

        await mySqlQury(
          `INSERT INTO tbl_exp_lp_additional_charges
            (lp_id, charge_name, calculation_based_on_min, calculation_based_on_max, min_value, max_value, condition_based, chargable_value_type, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            lp_id,
            charge_name || null,
            calculation_based_on_min || null,
            calculation_based_on_max || null,
            min_value || null,
            max_value || null,
            condition_based || null,
            chargable_value_type || null
          ]
        );
      }
    }

    // 5. Insert zones_input
    if (zoneRateAndslabAdd && Array.isArray(zoneRateAndslabAdd.slabs)) {
      for (const slab of zoneRateAndslabAdd.slabs) {
        if (slab && slab.zones_input) {
          for (const [zone_name, zone_value] of Object.entries(slab.zones_input)) {
            await mySqlQury(
              `INSERT INTO tbl_exp_lp_zones_rates (lp_id, zone_name, zone_value, created_at, updated_at)
               VALUES (?, ?, ?, NOW(), NOW())`,
              [lp_id, zone_name, zone_value]
            );
          }
        }
      }
    }

    // 6. Insert slab_additional
    if (zoneRateAndslabAdd && Array.isArray(zoneRateAndslabAdd.slabs)) {
      for (const slab of zoneRateAndslabAdd.slabs) {
        if (slab && Array.isArray(slab.slab_additional)) {
          for (const addObj of slab.slab_additional) {
            if (addObj && addObj.input) {
              for (const [zone_name, amount] of Object.entries(addObj.input)) {
                await mySqlQury(
                  `INSERT INTO tbl_exp_lp_slab_add_charges (lp_id, zone_name, amount, created_at, updated_at)
                   VALUES (?, ?, ?, NOW(), NOW())`,
                  [lp_id, zone_name, amount]
                );
              }
            }
          }
        }
      }
    }

    // In the POST route handler, after inserting into tbl_client_lp, add the update query:
await mySqlQury(
  `UPDATE tbl_client_lp
   SET status = 0, disable_by_superadmin = 1, duplicate = 1
   WHERE logictics_partner_id = ? AND client_id = ?`,
  [logisticsId, clientId]
);



    // Commit transaction
    await mySqlQury('COMMIT');
    res.json({ success: true, message: 'Express LP Rate List saved successfully.', new_lp_id: lp_id });
  } catch (err) {
    console.error('Error saving express LP rate list:', err);
    await mySqlQury('ROLLBACK');
    res.status(500).json({ success: false, message: 'Failed to save express LP rate list.' });
  }
});

//this i used for the update of the existing duplicate value
route.put('/api/update/express-lp-rate-list/:logisticsId/:clientId', auth, async (req, res) => {
  try {
    const { logisticsId: lp_id, clientId } = req.params;
    const {
      global_additional_charges = [],
      slab_inputs = {},
      volumetric_factor
    } = req.body;

    const nestedSlabs = unflattenSlabInputs(slab_inputs);
    const zoneRateAndslabAdd = nestedSlabs;

    await mySqlQury('START TRANSACTION');

    // 1. Delete existing additional charges for this LP
    await mySqlQury(`DELETE FROM tbl_exp_lp_additional_charges WHERE lp_id = ?`, [lp_id]);

    // 2. Delete existing zone rates
    await mySqlQury(`DELETE FROM tbl_exp_lp_zones_rates WHERE lp_id = ?`, [lp_id]);

    // 3. Delete existing slab additional charges
    await mySqlQury(`DELETE FROM tbl_exp_lp_slab_add_charges WHERE lp_id = ?`, [lp_id]);

    // 4. Re-insert global additional charges
    for (const charge of global_additional_charges) {
      const {
        charge_name,
        calculation_based_on_min,
        min_value,
        calculation_based_on_max,
        max_value,
        condition_based,
        chargable_value_type
      } = charge;

      await mySqlQury(
        `INSERT INTO tbl_exp_lp_additional_charges
         (lp_id, charge_name, calculation_based_on_min, calculation_based_on_max, min_value, max_value, condition_based, chargable_value_type, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          lp_id,
          charge_name || null,
          calculation_based_on_min || null,
          calculation_based_on_max || null,
          min_value || null,
          max_value || null,
          condition_based || null,
          chargable_value_type || null
        ]
      );
    }

    // 5. Re-insert zone rates
    if (Array.isArray(zoneRateAndslabAdd.slabs)) {
      for (const slab of zoneRateAndslabAdd.slabs) {
        const zones = slab.zones_input || {};
        for (const [zone_name, zone_value] of Object.entries(zones)) {
          await mySqlQury(
            `INSERT INTO tbl_exp_lp_zones_rates (lp_id, zone_name, zone_value, created_at, updated_at)
             VALUES (?, ?, ?, NOW(), NOW())`,
            [lp_id, zone_name, zone_value]
          );
        }
      }
    }

    // 6. Insert slab_additional
    if (Array.isArray(zoneRateAndslabAdd.slabs)) {
      for (const slab of zoneRateAndslabAdd.slabs) {
        if (Array.isArray(slab.slab_additional)) {
          for (const addObj of slab.slab_additional) {
            if (addObj && addObj.input) {
              for (const [zone_name, amount] of Object.entries(addObj.input)) {
                await mySqlQury(
                  `INSERT INTO tbl_exp_lp_slab_add_charges (lp_id, zone_name, amount, created_at, updated_at)
                   VALUES (?, ?, ?, NOW(), NOW())`,
                  [lp_id, zone_name, amount]
                );
              }
            }
          }
        }
      }
    }

    // 7. Conditionally update volumetric factor
    if (volumetric_factor) {
      await mySqlQury(
        `UPDATE tbl_logistics_partner SET volumetric_factor = ?, updated_at = NOW() WHERE id = ?`,
        [volumetric_factor, lp_id]
      );
    }

    await mySqlQury('COMMIT');
    res.json({ success: true, message: 'Express LP Rate List updated successfully.' });

  } catch (err) {
    await mySqlQury('ROLLBACK');
    console.error('Error updating express LP rate list:', err);
    res.status(500).json({ success: false, message: 'Failed to update express LP rate list.' });
  }
});
//ecom package rate list which shows on the ui of the ecom package
route.get('/api/ecom-lp-rate-list/:clientid/:logisticsId', async (req, res) => {
  try {
    const logisticsId = req.params.logisticsId;
    const clientId = req.params.clientid
    console.log("shabbar raza ansari",logisticsId,clientId);
    // console.log("jsdhjsdhsjd",dsjdjsd)
    // const courierId = 35;

    const [courierDetails] = await mySqlQury(
      `SELECT
     c.id AS courierId,
      lp.volumetric_factor,lp.parent_lp_id
    FROM tbl_logistics_partner lp
    LEFT JOIN tbl_courier_details c ON lp.courier_id = c.id
    WHERE lp.id = ?`,
    [logisticsId]
    );
    console.log("skdhsjkdhs",courierDetails)
    const volumetric_factor = courierDetails ? courierDetails.volumetric_factor : null;

    // 1. Get all weight slabs for this courier
    const slabs = await mySqlQury(`
      SELECT slab_id, min_weight, max_weight, unit
      FROM tbl_ecom_weightslabs
      WHERE courier_id = ?
    `, [courierDetails.courierId]);

    const formattedSlabs = [];
    console.log("slabs id",slabs)

    for (const slab of slabs) {
      const { slab_id: slabId, min_weight, max_weight, unit } = slab;

      // 2. Get zone rates for this weight slab
      const zoneRates = await mySqlQury(`
        SELECT zone_name, zone_value
        FROM tbl_ecom_lp_zones_rates
        WHERE lp_id = ?
      `, [logisticsId]);

      const zones = {};
      zoneRates.forEach(rate => {
        zones[rate.zone_name] = parseFloat(rate.zone_value);
      });

   

     // Use the helper
  const slab_additional_charges = await getSlabAdditionalChargesEcom({
    lpId: logisticsId,
    courierId: courierDetails.courierId,
    slabId
  });

      // 4. Push formatted slab
      formattedSlabs.push({
        min_weight,
        max_weight,
        unit,
        zones,
        slab_additional_charges
      });
    }

    // 5. Get global express additional charges
    const expressAdditionalCharges = await mySqlQury(`
      SELECT charge_id, charge_name, calculation_based_on_min, calculation_based_on_max, min_value, max_value, condition_based, chargable_value_type
      FROM tbl_ecom_lp_additional_charges
      WHERE lp_id = ?
    `, [logisticsId]);

    res.json({
      slabs: formattedSlabs,
      express_additional_charges: expressAdditionalCharges,
      volumetric_factor

    });

  } catch (error) {
    console.error('Error fetching express rate list:', error);
    res.status(500).json({ error: 'Failed to fetch express rate list' });
  }
});

// copy the ecom package rate list
route.post('/api/copy/ecom-lp-rate-list/:logisticsId/:clientId', auth, async (req, res) => {
  try {
    const { logisticsId, clientId } = req.params;
    console.log("req body",req.body)

    const {
      global_additional_charges = [],
      slab_inputs = {},
      volumetric_factor,
      business_volume,
    } = req.body;
    // console.log("jdgsjhdgshd",dsgdhsgdh)


    const nestedSlabs = unflattenSlabInputs(slab_inputs);
    const zoneRateAndslabAdd = nestedSlabs;
    console.log("zoneRateAnd slab",zoneRateAndslabAdd.slabs)

    // Start MySQL transaction
    await mySqlQury('START TRANSACTION');

    // 1. Get courier name and tagged_api from tbl_courier_details
    const [courierRows] = await mySqlQury(
      'SELECT * FROM tbl_logistics_partner WHERE id = ?',
      [logisticsId]
    );
    console.log("courier details",courierRows)
    if (!courierRows || courierRows.length === 0) {
      await mySqlQury('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Invalid courier_id' });
    }

    const lp_name = courierRows.name;
    const tagged_api = courierRows.tagged_api;
    const courier_id = courierRows.courier_id;
    // console.log("ghsaghgdhga",hdghsd)

    // 2. Insert new logistics partner (aggregator)
    const result = await mySqlQury(
      `INSERT INTO tbl_logistics_partner
        (tagged_api, courier_id, volumetric_factor, name, aggrigator_type,created_at, updated_at,parent_lp_id)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW(),?)`,
      [tagged_api, courier_id, volumetric_factor, lp_name,0,logisticsId]
    );
    const lp_id = result.insertId;

    // 3. Insert into tbl_client_lp
    await mySqlQury(
      `INSERT INTO tbl_client_lp (client_id, logictics_partner_id, status, disable_by_superadmin, recommended)
       VALUES (?, ?, 1, 0, 0)`,
      [clientId, lp_id]
    );

    // 4. Insert global_additional_charges
    if (Array.isArray(global_additional_charges)) {
      for (const charge of global_additional_charges) {
        const {
          charge_name,
          calculation_based_on_min,
          min_value,
          calculation_based_on_max,
          max_value,
          condition_based,
          chargable_value_type
        } = charge;

        await mySqlQury(
          `INSERT INTO tbl_ecom_lp_additional_charges
            (lp_id, charge_name, calculation_based_on_min, calculation_based_on_max, min_value, max_value, condition_based, chargable_value_type, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            lp_id,
            charge_name || null,
            calculation_based_on_min || null,
            calculation_based_on_max || null,
            min_value || null,
            max_value || null,
            condition_based || null,
            chargable_value_type || null
          ]
        );
      }
    }

    // 5. Insert zones_input
    if (zoneRateAndslabAdd && Array.isArray(zoneRateAndslabAdd.slabs)) {
      for (const slab of zoneRateAndslabAdd.slabs) {
        if (slab && slab.zones_input) {
          for (const [zone_name, zone_value] of Object.entries(slab.zones_input)) {
            await mySqlQury(
              `INSERT INTO tbl_ecom_lp_zones_rates (lp_id, zone_name, zone_value, created_at, updated_at)
               VALUES (?, ?, ?, NOW(), NOW())`,
              [lp_id, zone_name, zone_value]
            );
          }
        }
      }
    }

    // 6. Insert slab_additional
    if (zoneRateAndslabAdd && Array.isArray(zoneRateAndslabAdd.slabs)) {
      for (const slab of zoneRateAndslabAdd.slabs) {
        if (slab && Array.isArray(slab.slab_additional)) {
          for (const addObj of slab.slab_additional) {
            if (addObj && addObj.input) {
              for (const [zone_name, amount] of Object.entries(addObj.input)) {
                await mySqlQury(
                  `INSERT INTO tbl_ecom_lp_slab_add_charges (lp_id, zone_name, amount, created_at, updated_at)
                   VALUES (?, ?, ?, NOW(), NOW())`,
                  [lp_id, zone_name, amount]
                );
              }
            }
          }
        }
      }
    }

    // In the POST route handler, after inserting into tbl_client_lp, add the update query:
await mySqlQury(
  `UPDATE tbl_client_lp
   SET status = 0, disable_by_superadmin = 1, duplicate = 1
   WHERE logictics_partner_id = ? AND client_id = ?`,
  [logisticsId, clientId]
);



    // Commit transaction
    await mySqlQury('COMMIT');
    res.json({ success: true, message: 'Express LP Rate List saved successfully.', new_lp_id: lp_id });
  } catch (err) {
    console.error('Error saving express LP rate list:', err);
    await mySqlQury('ROLLBACK');
    res.status(500).json({ success: false, message: 'Failed to save express LP rate list.' });
  }
});

//this i used for the update of the existing duplicate value of the ecom package rate list
route.put('/api/update/ecom-lp-rate-list/:logisticsId/:clientId', auth, async (req, res) => {
  try {
    const { logisticsId: lp_id, clientId } = req.params;
    const {
      global_additional_charges = [],
      slab_inputs = {},
      volumetric_factor
    } = req.body;

    const nestedSlabs = unflattenSlabInputs(slab_inputs);
    const zoneRateAndslabAdd = nestedSlabs;

    await mySqlQury('START TRANSACTION');

    // 1. Delete existing additional charges for this LP
    await mySqlQury(`DELETE FROM tbl_ecom_lp_additional_charges WHERE lp_id = ?`, [lp_id]);

    // 2. Delete existing zone rates
    await mySqlQury(`DELETE FROM tbl_ecom_lp_zones_rates WHERE lp_id = ?`, [lp_id]);

    // 3. Delete existing slab additional charges
    await mySqlQury(`DELETE FROM tbl_ecom_lp_slab_add_charges WHERE lp_id = ?`, [lp_id]);

    // 4. Re-insert global additional charges
    for (const charge of global_additional_charges) {
      const {
        charge_name,
        calculation_based_on_min,
        min_value,
        calculation_based_on_max,
        max_value,
        condition_based,
        chargable_value_type
      } = charge;

      await mySqlQury(
        `INSERT INTO tbl_ecom_lp_additional_charges
         (lp_id, charge_name, calculation_based_on_min, calculation_based_on_max, min_value, max_value, condition_based, chargable_value_type, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          lp_id,
          charge_name || null,
          calculation_based_on_min || null,
          calculation_based_on_max || null,
          min_value || null,
          max_value || null,
          condition_based || null,
          chargable_value_type || null
        ]
      );
    }

    // 5. Re-insert zone rates
    if (Array.isArray(zoneRateAndslabAdd.slabs)) {
      for (const slab of zoneRateAndslabAdd.slabs) {
        const zones = slab.zones_input || {};
        for (const [zone_name, zone_value] of Object.entries(zones)) {
          await mySqlQury(
            `INSERT INTO tbl_ecom_lp_zones_rates (lp_id, zone_name, zone_value, created_at, updated_at)
             VALUES (?, ?, ?, NOW(), NOW())`,
            [lp_id, zone_name, zone_value]
          );
        }
      }
    }

    // 6. Insert slab_additional
    if (Array.isArray(zoneRateAndslabAdd.slabs)) {
      for (const slab of zoneRateAndslabAdd.slabs) {
        if (Array.isArray(slab.slab_additional)) {
          for (const addObj of slab.slab_additional) {
            if (addObj && addObj.input) {
              for (const [zone_name, amount] of Object.entries(addObj.input)) {
                await mySqlQury(
                  `INSERT INTO tbl_ecom_lp_slab_add_charges (lp_id, zone_name, amount, created_at, updated_at)
                   VALUES (?, ?, ?, NOW(), NOW())`,
                  [lp_id, zone_name, amount]
                );
              }
            }
          }
        }
      }
    }

    // 7. Conditionally update volumetric factor
    if (volumetric_factor) {
      await mySqlQury(
        `UPDATE tbl_logistics_partner SET volumetric_factor = ?, updated_at = NOW() WHERE id = ?`,
        [volumetric_factor, lp_id]
      );
    }

    await mySqlQury('COMMIT');
    res.json({ success: true, message: 'Express LP Rate List updated successfully.' });

  } catch (err) {
    await mySqlQury('ROLLBACK');
    console.error('Error updating express LP rate list:', err);
    res.status(500).json({ success: false, message: 'Failed to update express LP rate list.' });
  }
});
async function getSlabAdditionalChargesEcom({ lpId = null, courierId = null, slabId = null}) {
  let slab_additional_charges = [];

 
    // Get description, weight, unit from courier table
    const slabAdditionalChargesRaw = await mySqlQury(`
      SELECT charge_id, description, weight, unit
      FROM tbl_ecom_slab_additional_charges
      WHERE courier_id = ? AND weight_slab_id = ?
    `, [courierId, slabId]);

    for (const charge of slabAdditionalChargesRaw) {
      // Get amounts from LP table
      const amountsRaw = await mySqlQury(`
        SELECT zone_name, amount
        FROM tbl_ecom_lp_slab_add_charges
        WHERE lp_id = ?
      `, [lpId]);

      const amounts = {};
      amountsRaw.forEach(item => {
        amounts[item.zone_name] = parseFloat(item.amount);
      });

      slab_additional_charges.push({
        desc: charge.description,
        weight: charge.weight,
        unit: charge.unit,
        amounts
      });
    }
 

  return slab_additional_charges;
}


// update here the the using the put

// Helper to get slab additional charges for a given LP or courier
async function getSlabAdditionalCharges({ lpId = null, courierId = null, slabId = null}) {
  let slab_additional_charges = [];

 
    // Get description, weight, unit from courier table
    const slabAdditionalChargesRaw = await mySqlQury(`
      SELECT charge_id, description, weight, unit
      FROM tbl_exp_slab_additional_charges
      WHERE courier_id = ? AND weight_slab_id = ?
    `, [courierId, slabId]);

    for (const charge of slabAdditionalChargesRaw) {
      // Get amounts from LP table
      const amountsRaw = await mySqlQury(`
        SELECT zone_name, amount
        FROM tbl_exp_lp_slab_add_charges
        WHERE lp_id = ?
      `, [lpId]);

      const amounts = {};
      amountsRaw.forEach(item => {
        amounts[item.zone_name] = parseFloat(item.amount);
      });

      slab_additional_charges.push({
        desc: charge.description,
        weight: charge.weight,
        unit: charge.unit,
        amounts
      });
    }
 

  return slab_additional_charges;
}
// update the express rate list package forwarder
route.put('/api/package/express-rate-list/:courierId', async (req, res) => {
  try {
    const courierId = req.params.courierId;
    const { slabs } = req.body;
    mySqlQury('START TRANSACTION');

    // 1. Delete existing data for this courier
    await mySqlQury('DELETE FROM tbl_exp_slab_additionalamounts WHERE additional_charge_id IN (SELECT charge_id FROM tbl_exp_slab_additional_charges WHERE courier_id = ?)', [courierId]);
    await mySqlQury('DELETE FROM tbl_exp_slab_additional_charges WHERE courier_id = ?', [courierId]);
    await mySqlQury('DELETE FROM tbl_exp_zones_rates WHERE courier_id = ?', [courierId]);
    await mySqlQury('DELETE FROM tbl_exp_weightslabs WHERE courier_id = ?', [courierId]);

    // 2. Insert new slabs and related data
    for (const slab of slabs) {
      const { weightSlab, zones, additionalCharges } = slab;
      // Insert into tbl_exp_weightslabs
      const result = await mySqlQury(
        'INSERT INTO tbl_exp_weightslabs (courier_id, min_weight, max_weight, unit) VALUES (?, ?, ?, ?)',
        [courierId, weightSlab.min, weightSlab.max, weightSlab.unit]
      );
      const slabId = result.insertId;

      // Insert zones for this slab
      for (const [zoneName, zoneValue] of Object.entries(zones)) {
        await mySqlQury(
          'INSERT INTO tbl_exp_zones_rates (courier_id, weight_slab_id, zone_name, zone_value) VALUES (?, ?, ?, ?)',
          [courierId, slabId, zoneName, zoneValue]
        );
      }

      // Insert additional charges for this slab
      if (additionalCharges && additionalCharges.length > 0) {
        for (const charge of additionalCharges) {
          const { desc, weight, unit, amounts } = charge;
          // Insert into tbl_exp_slab_additional_charges
          const addChargeResult = await mySqlQury(
            'INSERT INTO tbl_exp_slab_additional_charges (courier_id, weight_slab_id, description, weight, unit) VALUES (?, ?, ?, ?, ?)',
            [courierId, slabId, desc, weight, unit]
          );
          const chargeId = addChargeResult.insertId;

          // Insert zone-wise amounts for this charge
          for (const [zoneName, amount] of Object.entries(amounts)) {
            await mySqlQury(
              'INSERT INTO tbl_exp_slab_additionalamounts (additional_charge_id, zone_name, amount) VALUES (?, ?, ?)',
              [chargeId, zoneName, amount]
            );
          }
        }
      }
    }
    mySqlQury('COMMIT');

    res.json({ success: true, message: 'Express rate list updated.' });
  } catch (error) {
    await mySqlQury('ROLLBACK');
    console.error('Error updating express rate list:', error);
    res.status(500).json({ error: 'Failed to update express rate list' });
  }
});

// update the express rate list package forwarder
route.put('/api/lp/package/express-rate-list/:logisticsId', async (req, res) => {
  try {
    const lp_id = req.params.logisticsId;
    const { slabs } = req.body;
    mySqlQury('START TRANSACTION');
    console.log("rew body",req.body)
    console.log("slabs ",slabs)
    // console.log("djsgdhshsydfy",dgshdgshdg)

        // 2. Delete existing zone rates
    await mySqlQury(`DELETE FROM tbl_exp_lp_zones_rates WHERE lp_id = ?`, [lp_id]);

    // 3. Delete existing slab additional charges
    await mySqlQury(`DELETE FROM tbl_exp_lp_slab_add_charges WHERE lp_id = ?`, [lp_id]);

    // 2. Insert new slabs and related data
    for (const slab of slabs) {
      const { weightSlab, zones, additionalCharges } = slab;
      // Insert into tbl_exp_weightslabs
     
      // Insert zones for this slab
      for (const [zoneName, zoneValue] of Object.entries(zones)) {
        await mySqlQury(
          'INSERT INTO tbl_exp_lp_zones_rates (lp_id, zone_name, zone_value, created_at, updated_at) VALUES (?, ?, ?, now(), now())',
          [lp_id, zoneName, zoneValue]
        );
      }

      // Insert additional charges for this slab
      if (additionalCharges && additionalCharges.length > 0) {
        for (const charge of additionalCharges) {
          const { desc, weight, unit, amounts } = charge;
         

          // Insert zone-wise amounts for this charge
          for (const [zoneName, amount] of Object.entries(amounts)) {
            await mySqlQury(
              'INSERT INTO tbl_exp_lp_slab_add_charges (lp_id, zone_name, amount, created_at, updated_at) VALUES (?,?,?,now(),now())',
              [lp_id, zoneName, amount]
            );
          }
        }
      }
    }
    mySqlQury('COMMIT');

    res.json({ success: true, message: 'Express rate list updated.' });
  } catch (error) {
    await mySqlQury('ROLLBACK');
    console.error('Error updating express rate list:', error);
    res.status(500).json({ error: 'Failed to update express rate list' });
  }
});
 
// route.get("/api/dashboard", async (req, res) => {
//   const clientId = req.query.client_id || null; // optional client filter
//   const today = new Date().toISOString().slice(0, 10);

//   try {
//     // Prepare queries
//     const queries = [
//       // 1. Today's Orders & Order Value
//       mySqlQury(
//         `SELECT 
//         -- Current month
//         (SELECT COUNT(*) / DAY(CURDATE())
//         FROM tbl_exp_orders
//         WHERE DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
//           AND DAY(created_at) <= DAY(CURDATE())
//         ) AS current_avg_orders,

//         (SELECT IFNULL(SUM(grand_total) / DAY(CURDATE()), 0)
//         FROM tbl_exp_orders
//         WHERE DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
//           AND DAY(created_at) <= DAY(CURDATE())
//         ) AS current_avg_order_value,

//         -- Previous month same range
//         (SELECT COUNT(*) / DAY(CURDATE())
//         FROM tbl_exp_orders
//         WHERE DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m')
//           AND DAY(created_at) <= DAY(CURDATE())
//         ) AS prev_avg_orders,

//         (SELECT IFNULL(SUM(grand_total) / DAY(CURDATE()), 0)
//         FROM tbl_exp_orders
//         WHERE DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m')
//           AND DAY(created_at) <= DAY(CURDATE())
//         ) AS prev_avg_order_value;
//       `,
//         clientId ? [today, clientId] : [today]
//       ),
//       // 3. Order Split by Payment Mode
//       mySqlQury(
//         `SELECT payment_mode, COUNT(*) as total
//          FROM tbl_exp_orders
//          WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
//          ${clientId ? "AND client_id=?" : ""}
//          GROUP BY payment_mode`,
//         clientId ? [clientId] : []
//       ),

//      await mySqlQury(`
//       SELECT 
//     CASE
//         WHEN LOWER(c.productType) LIKE '%air%' THEN 'Air'
//         WHEN LOWER(c.productType) LIKE '%surface%' THEN 'Surface'
//         ELSE 'Other'
//         END AS shipping_mode,
//         COUNT(*) AS total
//         FROM tbl_exp_lr lr
//         JOIN tbl_courier_details c ON lr.forwarder_id = c.id
//         WHERE lr.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
//           AND LOWER(c.courier_type) = LOWER('express')  -- express / ecom / ltr
//         GROUP BY shipping_mode;
//         `),

//       // 5. Shipment Split by Courier
//            mySqlQury(`
//       SELECT c.courier_name, COUNT(*) AS total
//       FROM tbl_exp_lr lr
//       JOIN tbl_courier_details c ON lr.forwarder_id = c.id
//       WHERE lr.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
//         AND LOWER(c.courier_type) = LOWER('express')  -- express / ecom / ltr
//       GROUP BY c.id, c.courier_name
//       ORDER BY total DESC;
//       `),

//           // current period orders vs previous orders
//     mySqlQury(`SELECT
//     -- Today vs Yesterday
//     SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS today_orders,
//     SUM(CASE WHEN DATE(created_at) = CURDATE() - INTERVAL 1 DAY THEN 1 ELSE 0 END) AS yesterday_orders,

//     -- This week vs Last week
//     SUM(CASE WHEN YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) THEN 1 ELSE 0 END) AS this_week_orders,
//     SUM(CASE WHEN YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) - 1 THEN 1 ELSE 0 END) AS last_week_orders,

//     -- This month vs Last month
//     SUM(CASE WHEN YEAR(created_at)=YEAR(CURDATE()) AND MONTH(created_at)=MONTH(CURDATE()) THEN 1 ELSE 0 END) AS this_month_orders,
//     SUM(CASE WHEN YEAR(created_at)=YEAR(CURDATE() - INTERVAL 1 MONTH) AND MONTH(created_at)=MONTH(CURDATE() - INTERVAL 1 MONTH) THEN 1 ELSE 0 END) AS last_month_orders,

//     -- This quarter vs Last quarter
//     SUM(CASE WHEN QUARTER(created_at) = QUARTER(CURDATE()) AND YEAR(created_at)=YEAR(CURDATE()) THEN 1 ELSE 0 END) AS this_quarter_orders,
//     SUM(CASE WHEN QUARTER(created_at) = QUARTER(CURDATE() - INTERVAL 3 MONTH) AND YEAR(created_at)=YEAR(CURDATE() - INTERVAL 3 MONTH) THEN 1 ELSE 0 END) AS last_quarter_orders
//     FROM tbl_exp_orders;
//     `),

//     await mySqlQury(`
//       SELECT
//           -- Today vs Yesterday
//           SUM(CASE WHEN DATE(created_at) = CURDATE() THEN total_lr_charges ELSE 0 END) AS today_value,
//           SUM(CASE WHEN DATE(created_at) = CURDATE() - INTERVAL 1 DAY THEN total_lr_charges ELSE 0 END) AS yesterday_value,

//           -- This week vs Last week
//           SUM(CASE WHEN YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) THEN total_lr_charges ELSE 0 END) AS this_week_value,
//           SUM(CASE WHEN YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) - 1 THEN total_lr_charges ELSE 0 END) AS last_week_value,

//           -- This month vs Last month
//           SUM(CASE WHEN YEAR(created_at)=YEAR(CURDATE()) AND MONTH(created_at)=MONTH(CURDATE()) THEN total_lr_charges ELSE 0 END) AS this_month_value,
//           SUM(CASE WHEN YEAR(created_at)=YEAR(CURDATE() - INTERVAL 1 MONTH) AND MONTH(created_at)=MONTH(CURDATE() - INTERVAL 1 MONTH) THEN total_lr_charges ELSE 0 END) AS last_month_value,

//           -- This quarter vs Last quarter
//           SUM(CASE WHEN QUARTER(created_at) = QUARTER(CURDATE()) AND YEAR(created_at)=YEAR(CURDATE()) THEN total_lr_charges ELSE 0 END) AS this_quarter_value,
//           SUM(CASE WHEN QUARTER(created_at) = QUARTER(CURDATE() - INTERVAL 3 MONTH) AND YEAR(created_at)=YEAR(CURDATE() - INTERVAL 3 MONTH) THEN total_lr_charges ELSE 0 END) AS last_quarter_value
//       FROM tbl_exp_lr
//     `),
//     mySqlQury(`
//       SELECT 
//     CASE 
//         WHEN lr.chargable_weight <= 0.5 THEN '0-0.5kg'
//         WHEN lr.chargable_weight <= 1 THEN '0.5-1kg'
//         WHEN lr.chargable_weight <= 2 THEN '1-2kg'
//         WHEN lr.chargable_weight <= 5 THEN '2-5kg'
//         WHEN lr.chargable_weight <= 10 THEN '5-10kg'
//         ELSE '>10kg'
//     END AS weight_bucket,
//     COUNT(*) AS total
//     FROM tbl_exp_lr lr
//     WHERE lr.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
//     GROUP BY weight_bucket
//     ORDER BY 
//     CASE weight_bucket
//         WHEN '0-0.5kg' THEN 1
//         WHEN '0.5-1kg' THEN 2
//         WHEN '1-2kg' THEN 3
//         WHEN '2-5kg' THEN 4
//         WHEN '5-10kg' THEN 5
//         ELSE 6
//           END;
//       `),
//       mySqlQury(`
//         SELECT lr.destination_zone AS state, COUNT(*) AS total_orders
//       FROM tbl_exp_lr lr
//       WHERE lr.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
//         AND lr.destination_zone IS NOT NULL
//       GROUP BY lr.destination_zone
//       ORDER BY total_orders DESC
//       LIMIT 5;
//       `),
//       mySqlQury(`
//         SELECT 
//           SUM(CASE WHEN lr.status = 4 THEN 1 ELSE 0 END) AS on_time,
//           SUM(CASE WHEN lr.status IN (3,7,8) THEN 1 ELSE 0 END) AS delay,
//           SUM(CASE WHEN lr.status = 5 THEN 1 ELSE 0 END) AS rto
//       FROM tbl_exp_lr lr
//       WHERE lr.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);
//       `)

//     ];
    


//     // Execute all queries in parallel
//     const [
//       businessInsights,
//       paymentSplit,
//       shippingSplit,
//       courierSplit,
//       totalOrdersInsight,
//       totalValueInsight,
//       ShipmentSplitByWeight,
//       OrderSplitAcrossTopStates,
//       DeliveryPerformance
//     ] = await Promise.all(queries);
//     //Business insights


//     const currentAvgOrders = Number(businessInsights[0].current_avg_orders || 0);
//     const prevAvgOrders = Number(businessInsights[0].prev_avg_orders || 0);
//     const currentAvgValue = Number(businessInsights[0].current_avg_order_value || 0);
//     const prevAvgValue = Number(businessInsights[0].prev_avg_order_value || 0);
//     const orderChangePct = prevAvgOrders > 0 
//         ? ((currentAvgOrders - prevAvgOrders) / prevAvgOrders * 100).toFixed(2)
//         : 0;
//     const valueChangePct = prevAvgValue > 0
//         ? ((currentAvgValue - prevAvgValue) / prevAvgValue * 100).toFixed(2)
//         : 0;
//     let businessInsightObj  ={currentAvgOrders, prevAvgOrders, currentAvgValue, prevAvgValue, orderChangePct, valueChangePct}
//     // Map shipment status to readable labels
//     const shipmentSplitByStatus = shippingSplit.map(row => ({
//       status: row.status,
//       statusLabel: statusMap[row.status] || "Unknown",
//       total: row.total,
//     }));

//       // Helper for percentage calculation
//     const calcPct = (current, previous) => {
//       if (!previous) return 0;
//       return Number((((current - previous) / previous) * 100).toFixed(2));
//     };
    
//     let orderInsight = totalOrdersInsight[0]
//      let valueInsight = totalValueInsight[0]


//     const orderJsonResponse = {
//       todayOrders: {
//         count: orderInsight.today_orders || 0,
//         change: orderInsight.today_orders - orderInsight.yesterday_orders,
//         percentage: calcPct(orderInsight.today_orders, orderInsight.yesterday_orders),
//       },
//       weekOrders: {
//         count: orderInsight.this_week_orders || 0,
//         change: orderInsight.this_week_orders - orderInsight.last_week_orders,
//         percentage: calcPct(orderInsight.this_week_orders, orderInsight.last_week_orders),
//       },
//       monthOrders: {
//         count: orderInsight.this_month_orders || 0,
//         change: orderInsight.this_month_orders - orderInsight.last_month_orders,
//         percentage: calcPct(orderInsight.this_month_orders, orderInsight.last_month_orders),
//       },
//       quarterOrders: {
//         count: orderInsight.this_quarter_orders || 0,
//         change: orderInsight.this_quarter_orders - orderInsight.last_quarter_orders,
//         percentage: calcPct(orderInsight.this_quarter_orders, orderInsight.last_quarter_orders),
//       }
//     };

//     // order value insight
//      const valueJsonResponse = {
//       todayValue: {
//         value: Number(valueInsight.today_value || 0),
//         change: Number(valueInsight.today_value - valueInsight.yesterday_value || 0),
//         percentage: calcPct(valueInsight.today_value, valueInsight.yesterday_value),
//       },
//       weekValue: {
//         value: Number(valueInsight.this_week_value || 0),
//         change: Number(valueInsight.this_week_value - valueInsight.last_week_value || 0),
//         percentage: calcPct(valueInsight.this_week_value, valueInsight.last_week_value),
//       },
//       monthValue: {
//         value: Number(valueInsight.this_month_value || 0),
//         change: Number(valueInsight.this_month_value - valueInsight.last_month_value || 0),
//         percentage: calcPct(valueInsight.this_month_value, valueInsight.last_month_value),
//       },
//       quarterValue: {
//         value: Number(valueInsight.this_quarter_value || 0),
//         change: Number(valueInsight.this_quarter_value - valueInsight.last_quarter_value || 0),
//         percentage: calcPct(valueInsight.this_quarter_value, valueInsight.last_quarter_value),
//       }
//     };


//     res.json({
//      businessInsightObj,
//       orderSplitByPaymentMode: paymentSplit,
//       shipmentSplitByStatus: shipmentSplitByStatus,
//       shipmentSplitByCourier: courierSplit,
//       orderJsonResponse,
//       valueJsonResponse,
//       ShipmentSplitByWeight,  
//       OrderSplitAcrossTopStates,
//       DeliveryPerformance     
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server Error" });
//   }
// });
route.post('/shopify-credential', async (req, res, next) => {
  try {
    const { shopyfy_url, accessToken } = req.body;
    // const roleData = req.user;

 const clientId = 59;
    // Save or update Shopify integration
    // const integrationQuery = `
    //   INSERT INTO tbl_shopify_integration (clientId, shopyfy_url, accessToken)
    //   VALUES (?, ?, ?)
    //   ON DUPLICATE KEY UPDATE accessToken = VALUES(accessToken)
    // `;
    // await mySqlQury(integrationQuery, [clientId, shopyfy_url, accessToken]);

    // Fetch orders
    const orderResponse = await axios.get(`https://${shopyfy_url}/admin/api/2023-10/orders.json`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      }
    });

    // Fetch locations
    const locationResponse = await axios.get(`https://${shopyfy_url}/admin/api/2025-07/locations.json`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      }
    });

    const locations = locationResponse.data.locations || [];
    const orders = orderResponse.data.orders || [];

    const values = [];
    const productValues = [];
    const boxValues = [];

    for (const order of orders) {
      const order_id = String(order.id);
      const po_no = await generateCustomPONumber();

      // Extract origin details from locations
      let origin_pincode = '', origin_state = '', origin_city = '';
      const locationData = locations.find(loc => loc.id == order.location_id);
      if (locationData) {
        origin_pincode = locationData.zip || '';
        origin_state = locationData.province || '';
        origin_city = locationData.city || '';
      }

      for (const lineItem of order.line_items || []) {
        let height, width, length;

        // Fetch metafields
        const metaResponse = await axios.get(
          `https://${shopyfy_url}/admin/api/2025-07/orders/${order_id}/metafields.json`,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': accessToken,
            }
          }
        );

        const metafields = metaResponse.data.metafields || [];
        metafields.forEach((field) => {
          if (field.namespace === 'shipping') {
            try {
              const parsed = JSON.parse(field.value);
              if (field.key === 'height') height = Number(parsed.value);
              if (field.key === 'width') width = Number(parsed.value);
              if (field.key === 'length') length = Number(parsed.value);
            } catch (err) {
              console.warn(`Could not parse metafield: ${field.key}`);
            }
          }
        });

        const dimensionValue = (height && width && length)
          ? length * height * width
          : null;

        // Insert into tbl_unprocessed_order
        values.push([
          clientId,
          order_id,
          po_no,
          Number(order.current_subtotal_price),
          order.shipping_address?.city || '',
          order.shipping_address?.province || '',
          order.shipping_address?.zip || '',
          order.shipping_address?.phone || '',
          `${order.shipping_address?.first_name || ''} ${order.shipping_address?.last_name || ''}`.trim(),
          origin_city,
          origin_state,
          origin_pincode,
          String(order?.payment_terms || ''),
          Number(lineItem?.quantity || 0),
          String(lineItem?.sku || ''),
          1,
          "e-commerce",
          Number(order.current_subtotal_price),
          String(order.id),
          String(order.confirmation_number),
          order.created_at,
        ]);

        // Insert into tbl_products
        productValues.push([
          String(lineItem.name),
          Number(lineItem?.quantity || 0),
          Number(order.id),
          po_no,
        ]);

        // Insert into tbl_boxes_dimension
        if (dimensionValue) {
          boxValues.push([
            po_no,
            Number(lineItem?.quantity || 0),
            String(dimensionValue),
            1,
            "cm",
          ]);
        }
      }
    }

    // Final bulk insert queries
    const insertOrders = `
      INSERT INTO tbl_unprocessed_order (
        client_id, order_id, po_no, Invoice_amount, destination_city,
        destination_state, destination_pincode, consignee_phone, consignee_name,
        origin_city, origin_state, origin_pincode, payment_type, quantity, sku,
        is_unprocessesd, order_type, Amount, order_value, invoice_no, order_date
      ) VALUES ?
      ON DUPLICATE KEY UPDATE order_id = VALUES(order_id)
    `;

    const insertProducts = `
      INSERT INTO tbl_products (
        product_name, quantity, order_value, po_no
      ) VALUES ?
      ON DUPLICATE KEY UPDATE po_no = po_no
    `;

    const insertBoxes = `
      INSERT INTO tbl_boxes_dimension (
        po_no, boxes, DIMENSION, is_unprocessesd, unit
      ) VALUES ?
      ON DUPLICATE KEY UPDATE po_no = po_no
    `;

    if (values.length) await mySqlQury(insertOrders, [values]);
    if (productValues.length) await mySqlQury(insertProducts, [productValues]);
    if (boxValues.length) await mySqlQury(insertBoxes, [boxValues]);

    res.status(200).json({ data: orders });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      details: error.message
    });
  }
});
route.post('/api/shopify-credential', async (req, res) => {
  try {
    const { clientId, shopyfy_url, accessToken } = req.body;
    let origin_pincode = '', origin_state = '', origin_city = '';

    const orderResponse = await axios.get(`https://${shopyfy_url}/admin/api/2023-10/orders.json`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      }
    });

    const locationResponse = await axios.get(`https://${shopyfy_url}/admin/api/2025-07/locations.json`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      }
    });

    const locations = locationResponse.data.locations || [];
    const orders = orderResponse.data.orders || [];

    const values = [];
    const productValues = [];
    const boxValues = [];
    const orderValue = [];

    for (const order of orders) {
      const order_id = String(order.id);
      const locationData = locations.find(loc => loc.id == order.location_id);

      if (locationData) {
        origin_pincode = locationData.zip || '';
        origin_state = locationData.province || '';
        origin_city = locationData.city || '';
      }

      let title = '';
      for (const tax_lines of order.tax_lines || []) {
        title = tax_lines.title || '';
      }

      for (const lineItem of order.line_items || []) {
        let height, width, length, unit = 'cm';

        // Fetch metafields
        const metaResponse = await axios.get(
          `https://${shopyfy_url}/admin/api/2025-07/orders/${order_id}/metafields.json`,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': accessToken,
            }
          }
        );

        const metafields = metaResponse.data.metafields || [];
        metafields.forEach((field) => {
          if (field.namespace === 'shipping') {
            try {
              const parsed = JSON.parse(field.value);
              if (field.key === 'height') height = Number(parsed.value);
              if (field.key === 'width') width = Number(parsed.value);
              if (field.key === 'length') length = Number(parsed.value);
            } catch (err) {
              console.warn(`Could not parse metafield: ${field.key}`);
            }
          }
        });

        let dimensionOutput = null;
        if (height && width && length) {
          dimensionOutput = {
            key: 'dimension',
            length,
            height,
            width,
            formula: `${length}*${height}*${width}`,
            value: length * height * width,
            unit
          };
        }

        const existingWareHouseId = await mySqlQury(
          'SELECT warehouse_id FROM tbl_add_warehouse WHERE client_id = ?;',
          [clientId]
        );

        // Check for existing records in all relevant tables
        const existingProduct = await mySqlQury(
          'SELECT * FROM tbl_ecom_product_details WHERE order_id = ?;',
          [order_id]
        );

        const existingBox = await mySqlQury(
          'SELECT * FROM tbl_ecom_boxes_details WHERE order_id = ?;',
          [order_id]
        );

        const existingOrder = await mySqlQury(
          'SELECT * FROM tbl_ecom_consignee_details WHERE order_id = ?;',
          [order_id]
        );

        const existingOrderInOrders = await mySqlQury(
          'SELECT * FROM tbl_ecom_orders WHERE orderid = ?;',
          [order_id]
        );

        // Only insert if the order_id does not exist in any of the tables
        if (existingProduct.length === 0 && existingBox.length === 0 && existingOrder.length === 0 && existingOrderInOrders.length === 0) {
          values.push([
            Number(order_id),
            "asd",
            `${order.shipping_address?.first_name || ''} ${order.shipping_address?.last_name || ''}`.trim(),
            Number(order.current_subtotal_price),
            String(lineItem?.sku || ''),
            Number(lineItem?.quantity || 0),
            2.5,
            "Percent",
            'CGST'
          ]);

          productValues.push([
            order_id,
            "asd",
            Number(length || 0),
            Number(width || 0),
            Number(height || 0),
            String(unit || ''),
            Number(lineItem?.grams || 0),
            "gram",
          ]);

          boxValues.push([
            "asd",
            String(order.reference || ''),
            String(order_id),
            String(order_id),
            Number(clientId),
            String(order?.payment_terms || ''),
            8.9,
            String(existingWareHouseId[0]?.warehouse_id || ''),
            Number(lineItem?.grams || 0),
            "gram",
            Number(order.current_total_price || 0),
            Number(lineItem?.quantity || 0),
            123,
            Number(order.current_total_tax || 0),
            Number(order.total_discounts || 0),
            0
          ]);

          orderValue.push([
            Number(order_id),
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
      }
    }

    // Insert queries
    if (values.length)
      await mySqlQury(`INSERT INTO tbl_ecom_product_details (
        order_id, category, name, price, sku, quantity, discount_value, discount_type, tax_type
      ) VALUES ?`, [values]);

    if (productValues.length)
      await mySqlQury(`INSERT INTO tbl_ecom_boxes_details (
        order_id, package_type, length, breadth, height, dimension_unit, weight, weight_unit
      ) VALUES ?`, [productValues]);

    if (boxValues.length)
      await mySqlQury(`INSERT INTO tbl_ecom_orders (
        channel, ref_number, orderid, invoice_no, client_id, payment_mode, collectable_amount, warehouse_id, 
        total_weight, weight_unit, grand_total, total_qty, box_qty, total_tax, total_discount, is_unprocessed
      ) VALUES ?`, [boxValues]);

    if (orderValue.length)
      await mySqlQury(`INSERT INTO tbl_ecom_consignee_details (
        order_id, first_name, last_name, email, phone, alternate_phone, address_line1, address_line2, landmark,
        country, state, city, pincode, billing_same_as_shipping, billing_first_name, billing_last_name, billing_email,
        billing_phone, billing_alternate_phone, billing_address_line1, billing_address_line2, billing_landmark,
        billing_country, billing_state, billing_city, billing_pincode
      ) VALUES ?`, [orderValue]);

    res.status(200).json({ data: "All Data is Saved" });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      details: error.message
    });
  }
});






// 🔹 Main sync function




function generateCustomPONumber() {
  const prefix = "PO";
  const middleFixed = "J4A";

  const part1 = String(Math.floor(10000 + Math.random() * 90000)); // 5-digit
  const part2 = String(Math.floor(1000 + Math.random() * 9000));   // 4-digit

  return `${prefix}-${part1}-${middleFixed}-${part2}`;
}





route.get('/all-data', auth, async (req, res) => {
  console.log('asdfjg')
  console.log(req.user.selectedClientId)
  let selectedId = req.user.selectedClientId || req.user.id;
 
  try {
    // Build base query
    let query = `
      SELECT *
      FROM tbl_exp_orders AS teo
      LEFT JOIN tbl_exp_lr AS tel 
        ON teo.id = tel.order_id
    `;

    // Conditionally add WHERE
    const params = [];
    if (selectedId != 1) {
      query += ` WHERE teo.client_id = ? `;
      params.push(selectedId);
    }

    // Always sort by newest first
    query += ` ORDER BY teo.created_at DESC `;

    const orders = await mySqlQury(query, params);
    // res.json(orders)
    // Pass data to EJS for rendering table
    res.render('pages/all-data', {
      title: 'Orders Summary',
      bodyClass: 'orders-page',
      activePage: 'orders',
      result:orders,           // all orders to show in table
      statusMap: {
        0: "Cancelled",
        1: "RTD",
        2: "Picked Up",
        3: "In Transit",
        4: "Delivered",
        5: "RTO",
        7: "NDR",
        8: "Out for Delivery",
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).render('pages/error', { message: 'Internal Server Error' });
  }
});

route.get("/api/dashboard", async (req, res) => {
  const clientId = req.query.client_id || null; 
  const courierType = req.query.courier_type || null; // express/ecom/ltr
  const today = new Date().toISOString().slice(0, 10);

  try {
    const courierCondition = courierType ? `AND LOWER(c.courier_type) = LOWER(?)` : "";
    const clientCondition = clientId ? "AND o.client_id=?" : "";

    const queries = [

      // 1️⃣ Business Insights
      mySqlQury(
        `SELECT 
          -- Current month
          (SELECT COUNT(*) / DAY(CURDATE())
           FROM tbl_exp_orders o
           JOIN tbl_exp_lr lr ON lr.order_id = o.id
           JOIN tbl_courier_details c ON lr.forwarder_id = c.id
           WHERE DATE_FORMAT(o.created_at, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
             AND DAY(o.created_at) <= DAY(CURDATE())
             ${courierCondition} ${clientCondition}
          ) AS current_avg_orders,

          (SELECT IFNULL(SUM(o.grand_total) / DAY(CURDATE()), 0)
           FROM tbl_exp_orders o
           JOIN tbl_exp_lr lr ON lr.order_id = o.id
           JOIN tbl_courier_details c ON lr.forwarder_id = c.id
           WHERE DATE_FORMAT(o.created_at, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
             AND DAY(o.created_at) <= DAY(CURDATE())
             ${courierCondition} ${clientCondition}
          ) AS current_avg_order_value,

          -- Previous month same range
          (SELECT COUNT(*) / DAY(CURDATE())
           FROM tbl_exp_orders o
           JOIN tbl_exp_lr lr ON lr.order_id = o.id
           JOIN tbl_courier_details c ON lr.forwarder_id = c.id
           WHERE DATE_FORMAT(o.created_at, '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m')
             AND DAY(o.created_at) <= DAY(CURDATE())
             ${courierCondition} ${clientCondition}
          ) AS prev_avg_orders,

          (SELECT IFNULL(SUM(o.grand_total) / DAY(CURDATE()), 0)
           FROM tbl_exp_orders o
           JOIN tbl_exp_lr lr ON lr.order_id = o.id
           JOIN tbl_courier_details c ON lr.forwarder_id = c.id
           WHERE DATE_FORMAT(o.created_at, '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m')
             AND DAY(o.created_at) <= DAY(CURDATE())
             ${courierCondition} ${clientCondition}
          ) AS prev_avg_order_value
        `,
        courierType
          ? (clientId
              ? [courierType, clientId, courierType, clientId, courierType, clientId, courierType, clientId]
              : [courierType, courierType, courierType, courierType])
          : (clientId ? [clientId, clientId, clientId, clientId] : [])
      ),

      // 2️⃣ Order Split by Payment Mode
      mySqlQury(
        `SELECT o.payment_mode, COUNT(*) as total
         FROM tbl_exp_orders o
         JOIN tbl_exp_lr lr ON lr.order_id = o.id
         JOIN tbl_courier_details c ON lr.forwarder_id = c.id
         WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
         ${courierCondition} ${clientCondition}
         GROUP BY o.payment_mode`,
        courierType ? (clientId ? [courierType, clientId] : [courierType]) : (clientId ? [clientId] : [])
      ),

      // 3️⃣ Shipment Split by Shipping Mode
      mySqlQury(
        `SELECT 
            CASE
                WHEN LOWER(c.productType) LIKE '%air%' THEN 'Air'
                WHEN LOWER(c.productType) LIKE '%surface%' THEN 'Surface'
                ELSE 'Other'
            END AS shipping_mode,
            COUNT(*) AS total
         FROM tbl_exp_lr lr
         JOIN tbl_courier_details c ON lr.forwarder_id = c.id
         WHERE lr.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
         ${courierCondition}
         GROUP BY shipping_mode`,
        courierType ? [courierType] : []
      ),

      // 4️⃣ Shipment Split by Courier
      mySqlQury(
        `SELECT c.courier_name, COUNT(*) AS total
         FROM tbl_exp_lr lr
         JOIN tbl_courier_details c ON lr.forwarder_id = c.id
         WHERE lr.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
         ${courierCondition}
         GROUP BY c.id, c.courier_name
         ORDER BY total DESC`,
        courierType ? [courierType] : []
      ),

      // 5️⃣ Orders Insight (today/week/month/quarter)
      mySqlQury(
        `SELECT
          SUM(CASE WHEN DATE(o.created_at) = CURDATE() THEN 1 ELSE 0 END) AS today_orders,
          SUM(CASE WHEN DATE(o.created_at) = CURDATE() - INTERVAL 1 DAY THEN 1 ELSE 0 END) AS yesterday_orders,
          SUM(CASE WHEN YEARWEEK(o.created_at, 1) = YEARWEEK(CURDATE(), 1) THEN 1 ELSE 0 END) AS this_week_orders,
          SUM(CASE WHEN YEARWEEK(o.created_at, 1) = YEARWEEK(CURDATE(), 1)-1 THEN 1 ELSE 0 END) AS last_week_orders,
          SUM(CASE WHEN YEAR(o.created_at)=YEAR(CURDATE()) AND MONTH(o.created_at)=MONTH(CURDATE()) THEN 1 ELSE 0 END) AS this_month_orders,
          SUM(CASE WHEN YEAR(o.created_at)=YEAR(CURDATE() - INTERVAL 1 MONTH) AND MONTH(o.created_at)=MONTH(CURDATE() - INTERVAL 1 MONTH) THEN 1 ELSE 0 END) AS last_month_orders,
          SUM(CASE WHEN QUARTER(o.created_at)=QUARTER(CURDATE()) AND YEAR(o.created_at)=YEAR(CURDATE()) THEN 1 ELSE 0 END) AS this_quarter_orders,
          SUM(CASE WHEN QUARTER(o.created_at)=QUARTER(CURDATE() - INTERVAL 3 MONTH) AND YEAR(o.created_at)=YEAR(CURDATE() - INTERVAL 3 MONTH) THEN 1 ELSE 0 END) AS last_quarter_orders
        FROM tbl_exp_orders o
        JOIN tbl_exp_lr lr ON lr.order_id = o.id
        JOIN tbl_courier_details c ON lr.forwarder_id = c.id
        WHERE 1=1
        ${courierCondition} ${clientCondition}`,
        courierType ? (clientId ? [courierType, clientId] : [courierType]) : (clientId ? [clientId] : [])
      ),

      // 6️⃣ Order Value Insight (from total_lr_charges)
      mySqlQury(
        `SELECT
          SUM(CASE WHEN DATE(lr.created_at) = CURDATE() THEN lr.total_lr_charges ELSE 0 END) AS today_value,
          SUM(CASE WHEN DATE(lr.created_at) = CURDATE() - INTERVAL 1 DAY THEN lr.total_lr_charges ELSE 0 END) AS yesterday_value,
          SUM(CASE WHEN YEARWEEK(lr.created_at, 1) = YEARWEEK(CURDATE(), 1) THEN lr.total_lr_charges ELSE 0 END) AS this_week_value,
          SUM(CASE WHEN YEARWEEK(lr.created_at, 1) = YEARWEEK(CURDATE(), 1)-1 THEN lr.total_lr_charges ELSE 0 END) AS last_week_value,
          SUM(CASE WHEN YEAR(lr.created_at)=YEAR(CURDATE()) AND MONTH(lr.created_at)=MONTH(CURDATE()) THEN lr.total_lr_charges ELSE 0 END) AS this_month_value,
          SUM(CASE WHEN YEAR(lr.created_at)=YEAR(CURDATE() - INTERVAL 1 MONTH) AND MONTH(lr.created_at)=MONTH(CURDATE() - INTERVAL 1 MONTH) THEN lr.total_lr_charges ELSE 0 END) AS last_month_value,
          SUM(CASE WHEN QUARTER(lr.created_at)=QUARTER(CURDATE()) AND YEAR(lr.created_at)=YEAR(CURDATE()) THEN lr.total_lr_charges ELSE 0 END) AS this_quarter_value,
          SUM(CASE WHEN QUARTER(lr.created_at)=QUARTER(CURDATE() - INTERVAL 3 MONTH) AND YEAR(lr.created_at)=YEAR(CURDATE() - INTERVAL 3 MONTH) THEN lr.total_lr_charges ELSE 0 END) AS last_quarter_value
        FROM tbl_exp_lr lr
        JOIN tbl_courier_details c ON lr.forwarder_id = c.id
        WHERE 1=1 ${courierCondition}`,
        courierType ? [courierType] : []
      ),

      // 7️⃣ Shipment Split by Weight
      mySqlQury(
        `SELECT 
            CASE 
                WHEN lr.chargable_weight <= 0.5 THEN '0-0.5kg'
                WHEN lr.chargable_weight <= 1 THEN '0.5-1kg'
                WHEN lr.chargable_weight <= 2 THEN '1-2kg'
                WHEN lr.chargable_weight <= 5 THEN '2-5kg'
                WHEN lr.chargable_weight <= 10 THEN '5-10kg'
                ELSE '>10kg'
            END AS weight_bucket,
            COUNT(*) AS total
        FROM tbl_exp_lr lr
        JOIN tbl_courier_details c ON lr.forwarder_id = c.id
        WHERE lr.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        ${courierCondition}
        GROUP BY weight_bucket
        ORDER BY 
          CASE weight_bucket
              WHEN '0-0.5kg' THEN 1
              WHEN '0.5-1kg' THEN 2
              WHEN '1-2kg' THEN 3
              WHEN '2-5kg' THEN 4
              WHEN '5-10kg' THEN 5
              ELSE 6
          END`,
        courierType ? [courierType] : []
      ),

      // 8️⃣ Top 5 States
      mySqlQury(
        `SELECT 
  tec.state AS state, 
  COUNT(*) AS total_orders
FROM 
  tbl_exp_lr lr
JOIN 
  tbl_exp_orders teo ON lr.order_id = teo.id
JOIN 
  tbl_exp_consignee_details tec ON tec.order_id = teo.id
JOIN 
  tbl_courier_details c ON lr.forwarder_id = c.id
WHERE 
  lr.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND tec.state IS NOT NULL
  ${courierCondition}
GROUP BY 
  tec.state
ORDER BY 
  total_orders DESC
LIMIT 5
`,
        courierType ? [courierType] : []
      ),

      // 9️⃣ Delivery Performance
      mySqlQury(
        `SELECT 
            SUM(CASE WHEN lr.status = 4 THEN 1 ELSE 0 END) AS on_time,
            SUM(CASE WHEN lr.status IN (3,7,8) THEN 1 ELSE 0 END) AS delay,
            SUM(CASE WHEN lr.status = 5 THEN 1 ELSE 0 END) AS rto
         FROM tbl_exp_lr lr
         JOIN tbl_courier_details c ON lr.forwarder_id = c.id
         WHERE lr.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
         ${courierCondition}`,
        courierType ? [courierType] : []
      )
    ];

    // Execute all queries in parallel
    const [
      businessInsights,
      paymentSplit,
      shippingSplit,
      courierSplit,
      totalOrdersInsight,
      totalValueInsight,
      ShipmentSplitByWeight,
      OrderSplitAcrossTopStates,
      DeliveryPerformance
    ] = await Promise.all(queries);

    // === Process Business Insights ===
    const currentAvgOrders = Number(businessInsights[0].current_avg_orders || 0);
    const prevAvgOrders = Number(businessInsights[0].prev_avg_orders || 0);
    const currentAvgValue = Number(businessInsights[0].current_avg_order_value || 0);
    const prevAvgValue = Number(businessInsights[0].prev_avg_order_value || 0);

    const calcPct = (curr, prev) => (!prev ? 0 : Number((((curr - prev) / prev) * 100).toFixed(2)));

    const businessInsightObj = {
      currentAvgOrders,
      prevAvgOrders,
      currentAvgValue,
      prevAvgValue,
      orderChangePct: calcPct(currentAvgOrders, prevAvgOrders),
      valueChangePct: calcPct(currentAvgValue, prevAvgValue)
    };

    // === Orders JSON ===
    const orderInsight = totalOrdersInsight[0];
    const orderJsonResponse = {
      todayOrders: {
        count: orderInsight.today_orders || 0,
        change: orderInsight.today_orders - orderInsight.yesterday_orders,
        percentage: calcPct(orderInsight.today_orders, orderInsight.yesterday_orders)
      },
      weekOrders: {
        count: orderInsight.this_week_orders || 0,
        change: orderInsight.this_week_orders - orderInsight.last_week_orders,
        percentage: calcPct(orderInsight.this_week_orders, orderInsight.last_week_orders)
      },
      monthOrders: {
        count: orderInsight.this_month_orders || 0,
        change: orderInsight.this_month_orders - orderInsight.last_month_orders,
        percentage: calcPct(orderInsight.this_month_orders, orderInsight.last_month_orders)
      },
      quarterOrders: {
        count: orderInsight.this_quarter_orders || 0,
        change: orderInsight.this_quarter_orders - orderInsight.last_quarter_orders,
        percentage: calcPct(orderInsight.this_quarter_orders, orderInsight.last_quarter_orders)
      }
    };

    // === Value JSON ===
    const valueInsight = totalValueInsight[0];
    const valueJsonResponse = {
      todayValue: {
        value: Number(valueInsight.today_value || 0),
        change: Number(valueInsight.today_value - valueInsight.yesterday_value || 0),
        percentage: calcPct(valueInsight.today_value, valueInsight.yesterday_value)
      },
      weekValue: {
        value: Number(valueInsight.this_week_value || 0),
        change: Number(valueInsight.this_week_value - valueInsight.last_week_value || 0),
        percentage: calcPct(valueInsight.this_week_value, valueInsight.last_week_value)
      },
      monthValue: {
        value: Number(valueInsight.this_month_value || 0),
        change: Number(valueInsight.this_month_value - valueInsight.last_month_value || 0),
        percentage: calcPct(valueInsight.this_month_value, valueInsight.last_month_value)
      },
      quarterValue: {
        value: Number(valueInsight.this_quarter_value || 0),
        change: Number(valueInsight.this_quarter_value - valueInsight.last_quarter_value || 0),
        percentage: calcPct(valueInsight.this_quarter_value, valueInsight.last_quarter_value)
      }
    };

    res.json({
      businessInsightObj,
      orderSplitByPaymentMode: paymentSplit,
      shipmentSplitByShippingMode: shippingSplit,
      shipmentSplitByCourier: courierSplit,
      orderJsonResponse,
      valueJsonResponse,
      ShipmentSplitByWeight,
      OrderSplitAcrossTopStates,
      DeliveryPerformance
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

route.get('/api/dashboard/shipments', auth, async (req, res) => {
  try {
    const clientId = req.user.client_id; // or get from req.query.clientId if needed

    // Fetch all LRs for client
    const results = await mySqlQury(
      `SELECT status FROM tbl_exp_lr WHERE client_id = ?`,
      [clientId]
    );

    const summary = {
      total_orders: results.length,
      unprocessed_orders: 0, // Placeholder: Define logic if applicable
      ready_to_dispatch: 0,
      cancelled_orders: 0, // Placeholder: Define logic if applicable
      delivered: 0,
      in_transit: 0,
      rto: 0,
      ndr: 0
    };

    results.forEach(row => {
      const status = row.status;
      switch (status) {
        case 1:
          summary.ready_to_dispatch++;
          break;
        case 2:
          summary.unprocessed_orders++; // Assuming pickup = unprocessed
          break;
        case 3:
          summary.in_transit++;
          break;
        case 4:
          summary.delivered++;
          break;
        case 5:
        case 7:
          summary.rto++;
          break;
        case 6:
        case 8:
          summary.ndr++;
          break;
        case 9:
          summary.cancelled_orders++; // Define status 9 as cancelled if needed
          break;
      }
    });

    // Calculate % for each status
    const total = summary.total_orders || 1; // avoid divide by zero
    const response = {
      totalOrders: summary.total_orders,
      unprocessedOrders: summary.unprocessed_orders,
      readyToDispatch: summary.ready_to_dispatch,
      cancelledOrders: summary.cancelled_orders,
      delivered: summary.delivered,
      inTransit: summary.in_transit,
      rto: summary.rto,
      ndr: summary.ndr,
      percent: {
        unprocessedOrders: ((summary.unprocessed_orders / total) * 100).toFixed(2),
        readyToDispatch: ((summary.ready_to_dispatch / total) * 100).toFixed(2),
        cancelledOrders: ((summary.cancelled_orders / total) * 100).toFixed(2),
        delivered: ((summary.delivered / total) * 100).toFixed(2),
        inTransit: ((summary.in_transit / total) * 100).toFixed(2),
        rto: ((summary.rto / total) * 100).toFixed(2),
        ndr: ((summary.ndr / total) * 100).toFixed(2)
      }
    };

    res.json(response);
  } catch (err) {
    console.error('Error fetching order summary:', err);
    res.status(500).json({ error: 'Failed to fetch order summary' });
  }
});

// shipment tracking page
route.get('/shipment-tracking', (req, res) => {
  // Assuming req.user.role or req.session.role contains the user's role
  // Adjust as per your authentication/session implementation
  const role = req.user?.role || req.session?.role || null;

  res.render('pages/shipment-tracking', {
    bodyClass: 'profile-page',
    activePage: 'profile',
    title: 'Client List',
    role: role
  });
});
route.get('/ecom/shipment-tracking', (req, res) => {
  // Assuming req.user.role or req.session.role contains the user's role
  // Adjust as per your authentication/session implementation
  const role = req.user?.role || req.session?.role || null;

  res.render('pages/ecom/shipment-tracking', {
    bodyClass: 'profile-page',
    activePage: 'profile',
    title: 'Client List',
    role: role
  });
});
route.get('/express/shipment-tracking', (req, res) => {
  // Assuming req.user.role or req.session.role contains the user's role
  // Adjust as per your authentication/session implementation
  const role = req.user?.role || req.session?.role || null;

  res.render('pages/express/shipment-tracking', {
    bodyClass: 'profile-page',
    activePage: 'profile',
    title: 'Client List',
    role: role
  });
});
route.get('/helpdesk', (req, res) => {
  // Assuming req.user.role or req.session.role contains the user's role
  // Adjust as per your authentication/session implementation
  const role = req.user?.role || req.session?.role || null;

  res.render('pages/helpdesk', {
    bodyClass: 'profile-page',
    activePage: 'profile',
    title: 'Client List',
    role: role
  });
});

route.get('/view-support-tickets', (req, res) => {
  // Assuming req.user.role or req.session.role contains the user's role
  // Adjust as per your authentication/session implementation
  const role = req.user?.role || req.session?.role || null;

  res.render('pages/view-support-tickets', {
    bodyClass: 'profile-page',
    activePage: 'profile',
    title: 'Client List',
    role: role
  });
});

route.get('/ndr-manager', (req, res) => {
  // Assuming req.user.role or req.session.role contains the user's role
  // Adjust as per your authentication/session implementation
  const role = req.user?.role || req.session?.role || null;

  res.render('pages/ndr-manager', {
    bodyClass: 'profile-page',
    activePage: 'profile',
    title: 'Client List',
    role: role
  });
});



route.get('/update-address-details', auth, async (req, res) => {
  try {
    const role = req.user?.role || req.session?.role || null;
    res.render('pages/update-address-details', {
      title: 'Client Package Manager',
      bodyClass: 'profile-page',
      activePage: 'client-package',
 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading packages');
  }
});
route.use('/', express.static(path.join(__dirname, './')))

// Layout
route.get('/horizontal', (req, res, next) => {
  res.render('layouts/horizontal', { title: 'Metrica', layout: 'partials/layout-horizontal' })
})
route.get('/horizontal-topbar-dark', (req, res, next) => {
  res.render('layouts/horizontal-topbar-dark', { title: 'Metrica', layout: 'partials/layout-horizontal' })
})
route.get('/vertical-dark', (req, res, next) => {
  res.render('layouts/vertical-dark', { title: 'Metrica', layout: 'partials/layout-vertical' })
})
route.get('/horizontal-dark', (req, res, next) => {
  res.render('layouts/horizontal-dark', { title: 'Metrica', layout: 'partials/layout-horizontal' })
})
route.get('/vertical-dark2', (req, res, next) => {
  res.render('layouts/vertical-dark2', { title: 'Metrica', layout: 'partials/layout-vertical2' })
})
route.get('/vertical-rtl', (req, res, next) => {
  res.render('layouts/vertical-rtl', { title: 'Metrica', layout: 'partials/layout-rtl' })
})
route.get('/rtl-layout2', (req, res, next) => {
  res.render('layouts/rtl-layout2', { title: 'Metrica', layout: 'partials/layout-vertical2' })
})
route.get('/rtl-horizontal', (req, res, next) => {
  res.render('layouts/rtl-horizontal', { title: 'Metrica', layout: 'partials/layout-horizontal' })
})
route.get('/rtl-dark', (req, res, next) => {
  res.render('layouts/vertical-rtl-dark', { title: 'Metrica', layout: 'partials/layout-rtl' })
})
route.get('/dark-sidebar', (req, res, next) => {
  res.render('layouts/dark-sidebar', { title: 'Metrica', layout: 'partials/layout-vertical2' })
})
route.get('/material', (req, res, next) => {
  res.render('layouts/material', { title: 'Metrica', layout: 'partials/layout-vertical2' })
})
route.get('/dark-topbar', (req, res, next) => {
  res.render('layouts/dark-topbar', { title: 'Metrica', layout: 'partials/layout-vertical2' })
})

module.exports = route;
const mappingRoles = {
  // ======================
  // AUTHENTICATION
  // ======================
  "GET /": { role: "auth-login", level: 4, type: "api" },
  "POST /": { role: "auth-login", level: 4, type: "api" },
  "GET /signup": { role: "auth-signup", level: 1, type: "page" },
  "POST /signup": { role: "auth-signup", level: 4, type: "api" },
  "GET /verify/:token": { role: "auth-verification", level: 4, type: "api" },
  "GET /check-verification-status": { role: "auth-verification", level: 4, type: "api" },
  "POST /resend-verification": { role: "auth-verification", level: 4, type: "api" },
  "GET /logout": { role: "auth-logout", level: 4, type: "api" },

  // ======================
  // DASHBOARD
  // ======================
  "GET /index": { role: "dashboard-view", level: 1, type: "page" },
  "GET /api/order-summary": { role: "dashboard-analytics", level: 4, type: "api" },
  "GET /order-stats": { role: "dashboard-analytics", level: 4, type: "api" },
  "GET /order-stats": { role: "dashboard-analytics", level: 4, type: "api" },

  // ======================
  // ORDER MANAGEMENT - COMMON
  // ======================
  "GET /order_details/:orderNumber": { role: "order-details", level: 4, type: "api" },
  "GET /order-details/:order_id": { role: "order-details", level: 4, type: "api" },
  "GET /all_orders": { role: "order-list", level: 4, type: "api" },
  "GET /fetch-orders": { role: "order-list", level: 4, type: "api" },
  "DELETE /delete-order": { role: "order-delete", level: 4, type: "api" },
  "GET /order-dispatched": { role: "order-status", level: 4, type: "api" },

  // ======================
  // ORDER CREATION
  // ======================
  "POST /create_order": { role: "order-create", level: 4, type: "api" },
  "POST /create_order_single": { role: "order-create", level: 4, type: "api" },
  "POST /create_order_multi": { role: "order-create", level: 4, type: "api" },
  "POST /api/create-order-express": { role: "order-create", level: 4, type: "api" },
  "POST /api/delhivery-create-order": { role: "order-create", level: 4, type: "api" },
  "GET /create-order-new": { role: "order-create", level: 4, type: "api" },

  // Bulk Order Creation
  "GET /ltl/create-bulk-order": { role: "bulk-order-create", level: 2, type: "page" },
  "GET /ecom/create-bulk-order": { role: "bulk-order-create", level: 2, type: "page" },
  "GET /express/create-bulk-order": { role: "bulk-order-create", level: 2, type: "page" },
  "POST /upload-excel-create-bulk-order": { role: "bulk-order-create", level: 4, type: "api" },

  // ======================
  // SERVICE TYPE PAGES
  // ======================
  "GET /express": { role: "service-express", level: 1, type: "page" },
  "GET /express/create-order": { role: "service-express", level: 2, type: "page" },
  "GET /ecom": { role: "service-ecom", level: 2, type: "page" },
  "GET /ecom/create-order": { role: "service-ecom", level: 2, type: "page" },
  "GET /ltl": { role: "service-ltl", level: 1, type: "page" },
  "GET /ltl/create-order": { role: "service-ltl", level: 2, type: "page" },

  // ======================
  // ORDER STATUS CATEGORIES
  // ======================
  // Express Status
  "GET /express/unprocessed-orders": { role: "status-express", level: 2, type: "page" },
  "GET /express/ready_to_dispatch_assinged_lr": { role: "status-express", level: 2, type: "page" },
  "GET /express/order-in-transit": { role: "status-express", level: 2, type: "page" },
  "GET /express/out-for-delivery": { role: "status-express", level: 2, type: "page" },
  "GET /express/order-delivered": { role: "status-express", level: 2, type: "page" },
  "GET /express/order-return": { role: "status-express", level: 2, type: "page" },
  "GET /express/cancelled-orders": { role: "status-express", level: 2, type: "page" },

  // Ecom Status
  "GET /ecom/unprocessed-orders": { role: "status-ecom", level: 2, type: "page" },
  "GET /ecom/ready_to_dispatch_assinged_lr": { role: "status-ecom", level: 2, type: "page" },
  "GET /ecom/order-in-transit": { role: "status-ecom", level: 2, type: "page" },
  "GET /ecom/out-for-delivery": { role: "status-ecom", level: 2, type: "page" },
  "GET /ecom/order-delivered": { role: "status-ecom", level: 2, type: "page" },
  "GET /ecom/order-return": { role: "status-ecom", level: 2, type: "page" },
  "GET /ecom/cancelled-orders": { role: "status-ecom", level: 2, type: "page" },

  // LTL Status
  "GET /ltl/unprocessed-orders": { role: "status-ltl", level: 2, type: "page" },
  "GET /ltl/ready_to_dispatch_assinged_lr": { role: "status-ltl", level: 2, type: "page" },
  "GET /ltl/order-in-transit": { role: "status-ltl", level: 2, type: "page" },
  "GET /ltl/out-for-delivery": { role: "status-ltl", level: 2, type: "page" },
  "GET /ltl/order-delivered": { role: "status-ltl", level: 2, type: "page" },
  "GET /ltl/order-return": { role: "status-ltl", level: 2, type: "page" },
  "GET /ltl/cancelled-orders": { role: "status-ltl", level: 2, type: "page" },

  // ======================
  // ORDER CANCELLATION
  // ======================
  "POST /api/cancel-delhivery-standard": { role: "order-cancel", level: 4, type: "api" },
  "POST /api/cancel-delhivery-ltl": { role: "order-cancel", level: 4, type: "api" },
  "POST /api/cancel-dtdc-standard": { role: "order-cancel", level: 4, type: "api" },
  "POST /api/cancel-expressbees-standard": { role: "order-cancel", level: 4, type: "api" },

  // ======================
  // SHIPPING & LABELS
  // ======================
  "GET /get-shipping-label": { role: "shipping-label", level: 4, type: "api" },
  "GET /api/shipping-label/delhivery-ltl": { role: "shipping-label", level: 4, type: "api" },
  "POST /api/print-bulk-labels": { role: "shipping-label", level: 4, type: "api" },
  "GET /delivery-shipping-label-links": { role: "shipping-label", level: 4, type: "api" },
  "GET /delhivery-standard-label": { role: "shipping-label", level: 4, type: "api" },

  // ======================
  // LR (LOAD RECEIPT) MANAGEMENT
  // ======================
  "POST /create_lr": { role: "lr-management", level: 4, type: "api" },
  "POST /create_lr/api": { role: "lr-management", level: 4, type: "api" },
  "POST /save_bulk_lr_automatic": { role: "lr-management", level: 4, type: "api" },
  "POST /create_bulk_lr_manual": { role: "lr-management", level: 4, type: "api" },
  "GET /get-manual-lr": { role: "lr-management", level: 4, type: "api" },
  "GET /mannual-lr-vault": { role: "lr-management", level: 4, type: "api" },
  "POST /upload-lr-data": { role: "lr-management", level: 4, type: "api" },
  "GET /filter-lrs": { role: "lr-management", level: 4, type: "api" },

  // ======================
  // TRACKING
  // ======================
  "GET /api/track-shipment": { role: "tracking", level: 4, type: "api" },
  "GET /delivery-status/:lrNo": { role: "tracking", level: 4, type: "api" },
  "GET /delivery-standard-status/:lrNo": { role: "tracking", level: 4, type: "api" },
  "GET /dtdc-ltl-status/:lrNo": { role: "tracking", level: 4, type: "api" },
  "GET /dtdc-standard-status/:lrNo": { role: "tracking", level: 4, type: "api" },
  "GET /expressbees-std/:lrNo": { role: "tracking", level: 4, type: "api" },
  "GET /tracking-master": { role: "tracking", level: 1, type: "page" },

  // ======================
  // WAREHOUSE MANAGEMENT
  // ======================
  "GET /warehouse": { role: "warehouse", level: 1, type: "page" },
  "POST /add_warehouse": { role: "warehouse", level: 4, type: "api" },
  "GET /api/warehouses/:id": { role: "warehouse", level: 4, type: "api" },
  "PUT /api/warehouses/:id": { role: "warehouse", level: 4, type: "api" },
  "GET /get_warehouse_addresses": { role: "warehouse", level: 4, type: "api" },
  "GET /get-warehouses-by-client": { role: "warehouse", level: 4, type: "api" },
  "GET /predispatch/api/location/:id": { role: "warehouse", level: 4, type: "api" },
  "GET /api/location/:id": { role: "warehouse", level: 4, type: "api" },

  // ======================
  // PINCODE SERVICES
  // ======================
  "POST /validate-pincode": { role: "pincode", level: 4, type: "api" },
  "POST /validate-pincode-master": { role: "pincode", level: 4, type: "api" },
  "GET /delivery/pincode-check": { role: "pincode", level: 4, type: "api" },
  "GET /delivery_ltl/pincode-check": { role: "pincode", level: 4, type: "api" },
  "GET /expressbees/pincode-check": { role: "pincode", level: 4, type: "api" },
  "GET /dtdc/pincode-check": { role: "pincode", level: 4, type: "api" },
  "GET /master-pincode": { role: "pincode", level: 1, type: "page" },
  "POST /api/master-pincode": { role: "pincode", level: 4, type: "api" },

  // ======================
  // CLIENT MANAGEMENT
  // ======================
  "GET /client-management": { role: "client", level: 1, type: "page" },
  "GET /client-onboarding": { role: "client", level: 1, type: "page" },
  "GET /client-list": { role: "client", level: 1, type: "page" },
  "DELETE /delete-client/:id": { role: "client", level: 4, type: "api" },
  "GET /api/client/:id": { role: "client", level: 4, type: "api" },
  "DELETE /api/client/:id": { role: "client", level: 4, type: "api" },
  "PUT /api/client/:id/parental": { role: "client", level: 4, type: "api" },
  "PUT /api/client/:id/departmental": { role: "client", level: 4, type: "api" },
  "PUT /api/clients/vas": { role: "client", level: 4, type: "api" },
  "GET /api/client-gst-number": { role: "client", level: 4, type: "api" },
  "GET /choose-user": { role: "client", level: 4, type: "api" },
  "GET /choose-clientComp/:clientId": { role: "client", level: 4, type: "api" },
  "POST /new_client": { role: "client", level: 4, type: "api" },
  "POST /predispatch/client_sign_in": { role: "client", level: 4, type: "api" },

  // ======================
  // KYC MANAGEMENT
  // ======================
  "GET /kyc": { role: "kyc", level: 1, type: "page" },
  "POST /submit-kyc": { role: "kyc", level: 4, type: "api" },
  "POST /approve-client-kyc": { role: "kyc", level: 4, type: "api" },
  "GET /kyc-list": { role: "kyc", level: 1, type: "page" },
  "POST /kyc/verify": { role: "kyc", level: 4, type: "api" },
  "POST /client-kyc-verification": { role: "kyc", level: 4, type: "api" },
  "POST /client-gstin-verification": { role: "kyc", level: 4, type: "api" },

  // ======================
  // FORWARDER/COURIER MANAGEMENT
  // ======================
  "GET /forwarder-onboarding": { role: "forwarder", level: 1, type: "page" },
  "GET /forwarder-list": { role: "forwarder", level: 1, type: "page" },
  "GET /forwarder_onboarding": { role: "forwarder", level: 1, type: "page" },
  "POST /predispatch/forwarder_onboarding": { role: "forwarder", level: 4, type: "api" },
  "POST /api/forwarder/onboard/ltl": { role: "forwarder", level: 4, type: "api" },
  "POST /api/forwarder/onboard/express": { role: "forwarder", level: 4, type: "api" },
  "POST /predispatch/forwarder_onboarding_stand": { role: "forwarder", level: 4, type: "api" },
  "GET /get-forwarders": { role: "forwarder", level: 4, type: "api" },
  "POST /get_forwarder_details": { role: "forwarder", level: 4, type: "api" },
  "POST /api/bulk-forwarding-partners": { role: "forwarder", level: 4, type: "api" },
  "GET /api/forwarding-partners": { role: "forwarder", level: 4, type: "api" },
  "GET /api/courier/:id": { role: "forwarder", level: 4, type: "api" },
  "PUT /api/courier/:id": { role: "forwarder", level: 4, type: "api" },
  "DELETE /courier/delete/:id": { role: "forwarder", level: 4, type: "api" },
  "POST /forwarder_update/:forwarderId": { role: "forwarder", level: 4, type: "api" },

  // Forwarder Contacts
  "GET /api/forwarder/contacts/:id": { role: "forwarder-contacts", level: 4, type: "api" },
  "PUT /api/forwarder/contacts/:id": { role: "forwarder-contacts", level: 4, type: "api" },

  // Forwarder Charges
  "GET /api/forwarder/charges/:id": { role: "forwarder-charges", level: 4, type: "api" },
  "GET /api/express/add-charges/:id": { role: "forwarder-charges", level: 4, type: "api" },
  "PUT /api/courier/charges/:id": { role: "forwarder-charges", level: 4, type: "api" },

  // ======================
  // AGGREGATOR MANAGEMENT
  // ======================
  "GET /aggrigator-onboarding": { role: "aggregator", level: 1, type: "page" },
  "POST /predispatch/Aggrigator_onboarding": { role: "aggregator", level: 4, type: "api" },
  "POST /predispatch/Aggrigator_onboarding_std": { role: "aggregator", level: 4, type: "api" },
  "GET /aggrigator-list": { role: "aggregator", level: 1, type: "page" },
  "GET /aggrigator-by-client/:clientId": { role: "aggregator", level: 4, type: "api" },
  "GET /api/aggrigator/:id": { role: "aggregator", level: 4, type: "api" },
  "PUT /api/aggrigator/:id": { role: "aggregator", level: 4, type: "api" },
  "DELETE /api/aggrigator/:id": { role: "aggregator", level: 4, type: "api" },
  "POST /save-agg-to-client": { role: "aggregator", level: 4, type: "api" },
  "POST /aggrigator/update-status": { role: "aggregator", level: 4, type: "api" },
  "POST /aggrigator/upload-pincode-csv": { role: "aggregator", level: 4, type: "api" },
  "POST /api/aggregator/toggle-recommendation": { role: "aggregator", level: 4, type: "api" },

  // ======================
  // RATE MANAGEMENT
  // ======================
  "GET /api/calculate-express-rate": { role: "rate-management", level: 4, type: "api" },
  "GET /api/standard-tat/:vendorId": { role: "rate-management", level: 4, type: "api" },
  "POST /api/standard-tat/save": { role: "rate-management", level: 4, type: "api" },
  "GET /api/standard-zone-mapping/:vendorId": { role: "rate-management", level: 4, type: "api" },
  "POST /api/standard-zone-mapping/save": { role: "rate-management", level: 4, type: "api" },
  "GET /api/ltl-zone-mapping/:vendorId": { role: "rate-management", level: 4, type: "api" },
  "POST /api/ltl-zone-mapping/save": { role: "rate-management", level: 4, type: "api" },
  "GET /api/vendor-rate-list/ltl/:vendorId": { role: "rate-management", level: 4, type: "api" },
  "GET /api/ltl-rate-list/:courierId": { role: "rate-management", level: 4, type: "api" },
  "GET /api/express-rate-list/:courierId": { role: "rate-management", level: 4, type: "api" },
  "PUT /api/express-rate-list/:courierId": { role: "rate-management", level: 4, type: "api" },
  "GET /api/vendor-tat/ltl/:vendorId": { role: "rate-management", level: 4, type: "api" },
  "POST /api/vendor-tat/ltl/save": { role: "rate-management", level: 4, type: "api" },
  "POST /api/vendor-rate-list/ltl/save": { role: "rate-management", level: 4, type: "api" },
  "GET /api/standard-rate-list/:vendorId": { role: "rate-management", level: 4, type: "api" },
  "POST /api/standard-rate-list/:vendorId": { role: "rate-management", level: 4, type: "api" },

  // ======================
  // BILLING & COD
  // ======================
  "GET /billing-reports": { role: "billing", level: 1, type: "page" },
  "GET /billingDateFilter": { role: "billing", level: 4, type: "api" },
  "GET /billingDateFilterForDonloadCSV": { role: "billing", level: 4, type: "api" },
  "GET /downloadOldInvoiceCSV": { role: "billing", level: 4, type: "api" },
  "GET /cod-dashboard": { role: "cod", level: 1, type: "page" },
  "GET /cod-summary": { role: "cod", level: 1, type: "page" },
  "POST /upload-remittance": { role: "cod", level: 4, type: "api" },
  "GET /get-utr-data": { role: "cod", level: 4, type: "api" },
  "GET /bank-reconsilation": { role: "cod", level: 1, type: "page" },
  "GET /to-be-remitted": { role: "cod", level: 1, type: "page" },
  "GET /remitted": { role: "cod", level: 1, type: "page" },
  "GET /billclientdata": { role: "billing", level: 4, type: "api" },

  // ======================
  // WALLET MANAGEMENT
  // ======================
  "GET /check-wallet-amount": { role: "wallet", level: 4, type: "api" },
  "POST /update-wallet": { role: "wallet", level: 4, type: "api" },
  "GET /domestic-wallet": { role: "wallet", level: 1, type: "page" },
  "POST /api/phonepay/initiate-payment": { role: "wallet", level: 4, type: "api" },
  "GET /api/phonepay/callback/:userId/:merchantOrderId": { role: "wallet", level: 4, type: "api" },
  "POST /api/whatsapp/initiate-payment": { role: "wallet", level: 4, type: "api" },
  "GET /api/whatsapp/callback/:userId/:merchantOrderId": { role: "wallet", level: 4, type: "api" },

  // ======================
  // USER MANAGEMENT
  // ======================
  "GET /user-management": { role: "user-management", level: 1, type: "page" },
  "GET /admin/view/:id": { role: "user-management", level: 4, type: "api" },
  "POST /admin/edit": { role: "user-management", level: 4, type: "api" },
  "POST /admin/deactivate": { role: "user-management", level: 4, type: "api" },
  "GET /permission-management": { role: "user-management", level: 1, type: "page" },
  "POST /permission_control": { role: "user-management", level: 4, type: "api" },
  "GET /api/getReportingUsers/:clientId": { role: "user-management", level: 4, type: "api" },

  // ======================
  // ROLE MANAGEMENT
  // ======================
  "GET /role-management": { role: "role-management", level: 1, type: "page" },
  "GET /manage-role": { role: "role-management", level: 1, type: "page" },
  "POST /api/roles": { role: "role-management", level: 4, type: "api" },
  "PATCH /api/roles/:id": { role: "role-management", level: 4, type: "api" },
  "DELETE /api/roles/:id": { role: "role-management", level: 4, type: "api" },

  // ======================
  // REPORTS
  // ======================
  "GET /awb-report": { role: "reports", level: 1, type: "page" },
  "GET /custom-report": { role: "reports", level: 1, type: "page" },
  "GET /master-docket": { role: "reports", level: 1, type: "page" },
  "GET /cod-reports": { role: "reports", level: 1, type: "page" },
  "POST /get-orders-rto": { role: "reports", level: 4, type: "api" },
  "POST /getOrders": { role: "reports", level: 4, type: "api" },
  "GET /download-excel": { role: "reports", level: 4, type: "api" },

  // ======================
  // API INTEGRATIONS
  // ======================
  "GET /api-integration": { role: "api-integration", level: 1, type: "page" },
  "GET /api-token-for-expressbees": { role: "api-integration", level: 4, type: "api" },
  "GET /api-token-for-delhivery": { role: "api-integration", level: 4, type: "api" },
  "GET /get-api-token": { role: "api-integration", level: 4, type: "api" },
  "POST /call-delhivery-api": { role: "api-integration", level: 4, type: "api" },
  "POST /woocommerce-data": { role: "api-integration", level: 4, type: "api" },
  "POST /api/logistic-partner/express": { role: "api-integration", level: 4, type: "api" },
  "POST /api/onboarding/ecom": { role: "api-integration", level: 4, type: "api" },

  // ======================
  // CHAT & WHATSAPP
  // ======================
  "GET /chat-ui": { role: "chat", level: 1, type: "page" },
  "GET /chat-ui-setting": { role: "chat", level: 1, type: "page" },
  "POST /api/whatsapp/subscribe": { role: "chat", level: 4, type: "api" },
  "POST /api/whatsapp/update-status": { role: "chat", level: 4, type: "api" },
  "POST /api/whatsapp/toggle-activation": { role: "chat", level: 4, type: "api" },
  "GET /api/customers/:customer_phone/:clientId/orders": { role: "chat", level: 4, type: "api" },
  "GET /api/orders/:orderId/:clientId/messages": { role: "chat", level: 4, type: "api" },
  "POST /api/messages": { role: "chat", level: 4, type: "api" },

  // ======================
  // MISC ROUTES
  // ======================
  "GET /test-route": { role: "misc", level: 4, type: "api" },
  "GET /get-po/:poNo": { role: "misc", level: 4, type: "api" },
  "GET /getTaggedApi": { role: "misc", level: 4, type: "api" },
  "GET /sellerDetails/:client_id": { role: "misc", level: 4, type: "api" },
  "POST /api/update-order-status": { role: "misc", level: 4, type: "api" },
  "GET /helpdesk-tickets": { role: "misc", level: 4, type: "api" },
  "GET /get-pickhub-code": { role: "misc", level: 4, type: "api" },
  "GET /api/box-dimensions/:ref_number": { role: "misc", level: 4, type: "api" },
  "GET /fetch-volumetric-data": { role: "misc", level: 4, type: "api" },
  "GET /get_aggrigator_details": { role: "misc", level: 4, type: "api" },
  "GET /get-aggregators/:clientId": { role: "misc", level: 4, type: "api" },
  "GET /api/aggrigator-partners/pincode": { role: "misc", level: 4, type: "api" },
  "GET /api/clients": { role: "misc", level: 4, type: "api" },
  "POST /api/client-products": { role: "misc", level: 4, type: "api" },
  "POST /api/get-forwarder-options": { role: "misc", level: 4, type: "api" },
  "GET /predispatch/edit/:id": { role: "misc", level: 4, type: "api" },
  "POST /update-return-status": { role: "misc", level: 4, type: "api" },
  "POST /update-pickup-status": { role: "misc", level: 4, type: "api" },
  "POST /predispatch/getCitiesAndUpdateStates": { role: "misc", level: 4, type: "api" },
  "POST /predispatch/getStatesBasedOnCities": { role: "misc", level: 4, type: "api" },
  "GET /getCities": { role: "misc", level: 4, type: "api" },
  "POST /upload-excel": { role: "misc", level: 4, type: "api" },

  // package
  "GET /package": { role: "package", level: 1, type: "page" }

};
//   // Use Object.values to get an array of values, then use Set to filter out duplicates
// function getRolesByLevel(level) {
//   const roles = Object.values(mappingRoles)
//     .filter(item => item.level >= level)
//     .map(item => item.role);

//   return [...new Set(roles)]; // remove duplicates
// }

function getRolesByLevel(level) {
  const apiRoles = [];
  const pageRoles = [];

  Object.values(mappingRoles).forEach(item => {
    if (item.level >= level) {
      if (item.type === "api") {
        apiRoles.push(item.role);
      } else if (item.type === "page") {
        pageRoles.push(item.role);
      }
    }
  });

  return {
    apiRoles: [...new Set(apiRoles)],
    pageRoles: [...new Set(pageRoles)],
  };
}


// function getRolesByLevel( parentId=1) {
//   const apiRoles = [];
//   const pageRoles = [];
//   let roleArray= [
//     'delete-role',
//     'update-roles',
//     'edit-roles',
//     'create-new-role',
//     'create-user',
//     'all-user-page',
//     'management-role',
//     'update-user',
//     'role-manage-page',
//     'dashboard-view',
//     'bulk-order-create',
//     'role-management'
//   ]
//   Object.values(mappingRoles).forEach(item => {
//     // Super Admin → include all
//     if (parentId === 1 || roleArray.includes(item.role)) {
//       if (item.type === "api") {
//         apiRoles.push(item.role);
//       } else if (item.type === "page") {
//         pageRoles.push(item.role);
//       }
//     }
//   });

//   return {
//     apiRoles: [...new Set(apiRoles)],
//     pageRoles: [...new Set(pageRoles)],
//   };
// }


module.exports = {
  mappingRoles,
  getRolesByLevel
};
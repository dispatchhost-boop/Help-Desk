const { mySqlQury } = require("../middleware/db");


// ====================== BASIC INFO ======================

const getLoginDetails = async (role, clientId, roleData) => {
  if (role === 1 || clientId === 1) {
    const [admin] = await mySqlQury('SELECT first_name, role_name, company_name, logo_path FROM tbl_admin WHERE id = ?', [roleData.id]);
    return admin;
  } else {
    const [client] = await mySqlQury('SELECT id, first_name, company_name, vas, logo_path FROM tbl_new_client WHERE login_id = ?', [clientId]);
    return client;
  }
};

const getWalletBalance = async (userId) => {
  const [wallet] = await mySqlQury('SELECT total_amount FROM tbl_wallet WHERE user_id = ?', [userId]);
  return wallet?.total_amount || 0;
};

const getProfile = async (id) => {
  const [profile] = await mySqlQury('SELECT first_name, role_name, company_name, logo_path FROM tbl_admin WHERE id = ?', [id]);
  return profile;
};

const getActiveTopics = async (role) => {
  const topics = await mySqlQury('SELECT topic_id FROM tbl_permissions WHERE role_id = ? AND is_active = 1', [role]);
  return topics.map(t => Number(t.topic_id));
};

// ====================== ORDER SUMMARY ======================

const getOrderSummary = async (clientId) => {
  const values = clientId > 0 ? [clientId, clientId] : [];

  const query = `
    SELECT
      (lr.po_no_count + uo.po_no_count) AS po_no_count,
      (lr.payment_cod_count + uo.payment_cod_count) AS payment_cod_count,
      (lr.payment_prepaid_count + uo.payment_prepaid_count) AS payment_prepaid_count,
      (lr.payment_payByCheck_count + uo.payment_payByCheck_count) AS payment_payByCheck_count
    FROM
    (
      SELECT
        COUNT(DISTINCT po_id) AS po_no_count,
        COUNT(DISTINCT CASE WHEN mode_Of_Payment = 'cod' THEN CONCAT(po_id, '-', mode_Of_Payment) END) AS payment_cod_count,
        COUNT(DISTINCT CASE WHEN mode_Of_Payment = 'pre-paid' THEN CONCAT(po_id, '-', mode_Of_Payment) END) AS payment_prepaid_count,
        COUNT(DISTINCT CASE WHEN mode_Of_Payment = 'payByCheck' THEN CONCAT(po_id, '-', mode_Of_Payment) END) AS payment_payByCheck_count
      FROM tbl_create_lr
      WHERE YEAR(order_date) = YEAR(CURDATE()) AND MONTH(order_date) = MONTH(CURDATE()) AND status IN (0,1,2,3,4,5)
      ${clientId > 0 ? "AND client_id = ?" : ""}
    ) AS lr,
    (
      SELECT
        COUNT(DISTINCT po_no) AS po_no_count,
        COUNT(DISTINCT CASE WHEN payment_type = 'cod' THEN CONCAT(po_no, '-', payment_type) END) AS payment_cod_count,
        COUNT(DISTINCT CASE WHEN payment_type = 'pre-paid' THEN CONCAT(po_no, '-', payment_type) END) AS payment_prepaid_count,
        COUNT(DISTINCT CASE WHEN payment_type = 'payByCheck' THEN CONCAT(po_no, '-', payment_type) END) AS payment_payByCheck_count
      FROM tbl_unprocessed_order
      WHERE YEAR(order_date) = YEAR(CURDATE()) AND MONTH(order_date) = MONTH(CURDATE()) AND is_unprocessesd = 1
      ${clientId > 0 ? "AND client_id = ?" : ""}
    ) AS uo
  `;

  const result = await mySqlQury(query, values);
  return result[0];
};

// ====================== RTO TREND CHART ======================

const getRTOTrend = async (clientId) => {
  const values = clientId > 0 ? [clientId] : [];

  const query = `
    SELECT
      order_date AS status_date,
      COALESCE(COUNT(DISTINCT CASE WHEN status IN (5, 7) THEN lr_No END), 0) AS count_value,
      COALESCE(COUNT(DISTINCT CASE WHEN status = 7 THEN lr_No END), 0) AS in_Transit_value,
      COALESCE(COUNT(DISTINCT CASE WHEN status = 5 THEN lr_No END), 0) AS delivered_value,
      COALESCE(
        COUNT(DISTINCT CASE WHEN status IN (5, 7) THEN lr_No END) -
        COUNT(DISTINCT CASE WHEN status = 5 THEN lr_No END), 0
      ) AS pending_value,
      COALESCE(
        ROUND(
          (COUNT(DISTINCT CASE WHEN status IN (5, 7) THEN lr_No END) -
           COUNT(DISTINCT CASE WHEN status = 5 THEN lr_No END)) * 100 /
           NULLIF(COUNT(DISTINCT CASE WHEN status IN (5, 7) THEN lr_No END), 0)
        , 0), 0
      ) AS rto_pending_percentage,
      COALESCE(
        ROUND(
          COUNT(DISTINCT CASE WHEN status = 7 THEN lr_No END) * 100 /
          NULLIF(COUNT(DISTINCT CASE WHEN status IN (5, 7) THEN lr_No END), 0)
        , 0), 0
      ) AS in_Transit_percentage,
      COALESCE(
        ROUND(
          COUNT(DISTINCT CASE WHEN status = 5 THEN lr_No END) * 100 /
          NULLIF(COUNT(DISTINCT CASE WHEN status IN (5, 7) THEN lr_No END), 0)
        , 0), 0
      ) AS delivered_percentage
    FROM tbl_create_lr
    WHERE 1 = 1
    ${clientId > 0 ? "AND client_id = ?" : ""}
    GROUP BY order_date
  `;

  const rows = await mySqlQury(query, values);
  return rows;
};

// ====================== CHART DATA: Delivered, RTO, Pending, Cancelled ======================

const getOrderStatusChart = async (clientId) => {
  const values = clientId > 0 ? [clientId, clientId, clientId, clientId] : [];

  const query = `
    WITH combinedData AS (
      SELECT DATE_FORMAT(order_date, '%Y-%m') AS order_month,  
        COUNT(DISTINCT po_id) AS po_id_dilivered_count,
        0 AS po_id_rto_count,
        0 AS total_pending_count,
        0 AS po_id_cancel_count
      FROM tbl_create_lr
      WHERE order_date >= DATE_FORMAT(CURDATE(), '%Y-01-01')  
        AND order_date <= LAST_DAY(CURDATE())
        AND status = 4
        ${clientId > 0 ? "AND client_id = ?" : ""}
      GROUP BY order_month
      UNION ALL
      SELECT DATE_FORMAT(order_date, '%Y-%m') AS order_month,
        0, COUNT(DISTINCT po_id), 0, 0
      FROM tbl_create_lr
      WHERE status = 5 AND order_date >= DATE_FORMAT(CURDATE(), '%Y-01-01') 
        AND order_date <= LAST_DAY(CURDATE())
        ${clientId > 0 ? "AND client_id = ?" : ""}
      GROUP BY order_month
      UNION ALL
      SELECT DATE_FORMAT(uo.order_date, '%Y-%m'),
        0, 0,
        COUNT(DISTINCT CASE WHEN uo.is_unprocessesd = 1 THEN uo.po_no END) + 
        COUNT(DISTINCT CASE WHEN lr.status IN (1,3) THEN lr.po_id END), 0
      FROM tbl_unprocessed_order uo
      LEFT JOIN tbl_create_lr lr ON uo.po_no = lr.po_id
      WHERE uo.order_date >= DATE_FORMAT(CURDATE(), '%Y-01-01')  
        AND uo.order_date <= LAST_DAY(CURDATE())
        ${clientId > 0 ? "AND uo.client_id = ?" : ""}
      GROUP BY order_month
      UNION ALL
      SELECT DATE_FORMAT(order_date, '%Y-%m'), 0, 0, 0, COUNT(DISTINCT po_id)
      FROM tbl_create_lr
      WHERE status = 0 AND order_date >= DATE_FORMAT(CURDATE(), '%Y-01-01') 
        AND order_date <= LAST_DAY(CURDATE())
        ${clientId > 0 ? "AND client_id = ?" : ""}
      GROUP BY order_month
    )
    SELECT order_month,
      SUM(po_id_dilivered_count) AS po_id_dilivered_count,
      SUM(po_id_rto_count) AS po_id_rto_count,
      SUM(total_pending_count) AS total_pending_count,
      SUM(po_id_cancel_count) AS po_id_cancel_count
    FROM combinedData
    GROUP BY order_month
    ORDER BY STR_TO_DATE(order_month, '%Y-%m')
  `;

  return await mySqlQury(query, values);
};

// ====================== AGING COUNT ======================

const getAgingData = async (table, statusCondition, clientId) => {
  const values = clientId > 0 ? [clientId] : [];
  const whereClause = clientId > 0 ? `AND client_id = ?` : '';

  const query = `
    SELECT
      COUNT(CASE WHEN order_date = CURDATE() THEN 1 END) AS Day_0,
      COUNT(CASE WHEN order_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN 1 END) AS Day_1,
      COUNT(CASE WHEN order_date = DATE_SUB(CURDATE(), INTERVAL 2 DAY) THEN 1 END) AS Day_2,
      COUNT(CASE WHEN order_date = DATE_SUB(CURDATE(), INTERVAL 3 DAY) THEN 1 END) AS Day_3,
      COUNT(CASE WHEN order_date = DATE_SUB(CURDATE(), INTERVAL 4 DAY) THEN 1 END) AS Day_4,
      COUNT(CASE WHEN order_date = DATE_SUB(CURDATE(), INTERVAL 5 DAY) THEN 1 END) AS Day_5,
      COUNT(CASE WHEN order_date = DATE_SUB(CURDATE(), INTERVAL 6 DAY) THEN 1 END) AS Day_6,
      COUNT(CASE WHEN order_date <= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 END) AS Day_7_plus
    FROM ${table}
    WHERE ${statusCondition}
    ${whereClause}
  `;

  const [data] = await mySqlQury(query, values);
  return data;
};

// ====================== EXPORT OBJECT ======================
const getStatusWiseCounts = async (statusArray, clientId) => {
    const values = clientId > 0 ? [clientId] : [];
  
    const query = `
      SELECT
        COUNT(DISTINCT po_id) AS po_id_count,
        COUNT(DISTINCT CASE WHEN mode_Of_Payment = 'cod' THEN CONCAT(po_id, '-cod') END) AS payment_cod_count,
        COUNT(DISTINCT CASE WHEN mode_Of_Payment = 'pre-paid' THEN CONCAT(po_id, '-pre-paid') END) AS payment_prepaid_count,
        COUNT(DISTINCT CASE WHEN mode_Of_Payment = 'payByCheck' THEN CONCAT(po_id, '-payByCheck') END) AS payment_payByCheck_count
      FROM tbl_create_lr
      WHERE YEAR(order_date) = YEAR(CURDATE())
        AND MONTH(order_date) = MONTH(CURDATE())
        AND status IN (${statusArray.join(',')})
        ${clientId > 0 ? "AND client_id = ?" : ""}
    `;
  
    const [data] = await mySqlQury(query, values);
    return data;
  };

  const getUnprocessedCounts = async (clientId) => {
    const values = clientId > 0 ? [clientId] : [];
  
    const query = `
      SELECT
        COUNT(DISTINCT po_no) AS po_no_count,
        COUNT(DISTINCT CASE WHEN payment_type = 'cod' THEN CONCAT(po_no, '-cod') END) AS payment_cod_count,
        COUNT(DISTINCT CASE WHEN payment_type = 'pre-paid' THEN CONCAT(po_no, '-pre-paid') END) AS payment_prepaid_count,
        COUNT(DISTINCT CASE WHEN payment_type = 'payByCheck' THEN CONCAT(po_no, '-payByCheck') END) AS payment_payByCheck_count
      FROM tbl_unprocessed_order
      WHERE YEAR(order_date) = YEAR(CURDATE())
        AND MONTH(order_date) = MONTH(CURDATE())
        AND is_unprocessesd = 1
        ${clientId > 0 ? "AND client_id = ?" : ""}
    `;
  
    const [data] = await mySqlQury(query, values);
    return data;
  };
  const getMonthlyOrderTrend = async (clientId) => {
    const values = clientId > 0 ? [clientId] : [];
  
    const query = `
      SELECT DATE(order_date) AS order_date, COUNT(po_no) AS po_count
      FROM tbl_unprocessed_order
      WHERE order_date >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
        AND order_date < DATE_FORMAT(DATE_ADD(CURRENT_DATE, INTERVAL 1 MONTH), '%Y-%m-01')
        ${clientId > 0 ? "AND client_id = ?" : ""}
      GROUP BY DATE(order_date)
      ORDER BY order_date
    `;
  
    return await mySqlQury(query, values);
  };
  const getMonthlyCreatedLRTrend = async (clientId) => {
    const values = clientId > 0 ? [clientId] : [];
  
    const query = `
      SELECT DATE(order_date) AS order_date, COUNT(po_id) AS po_count
      FROM tbl_create_lr
      WHERE order_date >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
        AND order_date < DATE_FORMAT(DATE_ADD(CURRENT_DATE, INTERVAL 1 MONTH), '%Y-%m-01')
        ${clientId > 0 ? "AND client_id = ?" : ""}
      GROUP BY DATE(order_date)
      ORDER BY order_date
    `;
  
    return await mySqlQury(query, values);
  };
      
  const dashboardService = {
    getLoginDetails,
    getWalletBalance,
    getProfile,
    getActiveTopics,
    getOrderSummary,
    getRTOTrend,
    getOrderStatusChart,
    getAgingData,
    getStatusWiseCounts,
    getUnprocessedCounts,
    getMonthlyOrderTrend,
    getMonthlyCreatedLRTrend
  };

module.exports = dashboardService;

// models/Admin.js
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    country_code: DataTypes.STRING,
    phone_no: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    role_name: DataTypes.STRING,
    client_name: DataTypes.STRING,
    client_id: DataTypes.INTEGER,
    is_active: DataTypes.TINYINT,
    user_type: DataTypes.STRING,
    reporting_user: DataTypes.STRING,
    reporting_id: DataTypes.INTEGER,
    logo_path: DataTypes.STRING,
    company_name: DataTypes.STRING,
    is_verified: DataTypes.TINYINT,
    is_kyc_verified: DataTypes.TINYINT,
    is_kyc_submitted: DataTypes.TINYINT,
    organization: DataTypes.STRING,
    gst: DataTypes.STRING,
    payment_mode: DataTypes.STRING,
    monthly_parcels: DataTypes.STRING,
    // note: your comment “ode for parcel volume bucket…” looked like a note,
    // so I’m not adding a column for it. Add one if it actually exists.
    company_type: DataTypes.STRING,
    verify_token: DataTypes.STRING,
    exp_volume: DataTypes.STRING,
    segment_type: DataTypes.STRING,
    parent_id: DataTypes.INTEGER,
    level: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER,
  }, {
    tableName: 'tbl_admin',
    timestamps: false,       // set true if you actually have created_at/updated_at
    underscored: true,
  });

  // Optional: virtual full_name
  Admin.prototype.getFullName = function () {
    const f = this.first_name || '';
    const l = this.last_name || '';
    return `${f} ${l}`.trim();
  };

  return Admin;
};

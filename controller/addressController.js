// controller/addressController.js
const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./config.env" }); // ✅ load correct file



// Configure transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.hostinger.com",
  port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ SMTP connection failed:", err);
  } else {
    console.log("✅ SMTP server is ready to take messages");
  }
});

exports.sendAddressVerification = async (req, res) => {
  try {
    const { name, email, order_id } = req.body;

    if (!email || !order_id) {
      return res.status(400).json({ ok: false, message: "Email and order_id are required" });
    }

    const updateUrl = `${process.env.BASE_URL}/update-address-details?order_id=${encodeURIComponent(order_id)}&email=${encodeURIComponent(email)}`;
    const subject = `Action Required: Update your address for Order ${order_id}`;

    const html = `
      <div style="font-family:Arial,sans-serif; line-height:1.5; color:#333;">
        <h2 style="color:#d9534f;">Hello ${name || "Customer"},</h2>
        <p>We were unable to verify your delivery address for <b>Order ID: ${order_id}</b>.</p>
        <p>Please click the button below to provide your <b>updated address and pincode</b>:</p>
        <a href="${updateUrl}" style="display:inline-block;background:#d9534f;color:#fff;padding:12px 20px;
                  border-radius:6px;text-decoration:none;font-weight:bold;">📝 Update Address Details</a>
        <p style="margin-top:15px;">Or copy this link:</p>
        <p><a href="${updateUrl}" target="_blank">${updateUrl}</a></p>
        <p style="margin-top:20px;">Thanks,<br/>Dispatch Logistics Team<br/>Email: ${process.env.EMAIL_FROM}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Dispatch Logistics" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject,
      html,
    });

    return res.json({
      ok: true,
      message: "Update address email sent successfully",
      data: { order_id, email_sent: true, update_url: updateUrl }
    });

  } catch (err) {
    console.error("❌ Error in sending address update mail:", err);
    return res.status(500).json({ ok: false, message: "Failed to send address update mail", error: err.message });
  }
};


exports.sendAddressVerificationecom = async (req, res) => {
  try {
    const { name, email, order_id } = req.body;

    if (!email || !order_id) {
      return res.status(400).json({ ok: false, message: "Email and order_id are required" });
    }

    const updateUrl = `${process.env.BASE_URL}/update-address-details?order_id=${encodeURIComponent(order_id)}&email=${encodeURIComponent(email)}`;
    const subject = `Action Required: Update your address for Order ${order_id}`;

    const html = `
      <div style="font-family:Arial,sans-serif; line-height:1.5; color:#333;">
        <h2 style="color:#d9534f;">Hello ${name || "Customer"},</h2>
        <p>We were unable to verify your delivery address for <b>Order ID: ${order_id}</b>.</p>
        <p>Please click the button below to provide your <b>updated address and pincode</b>:</p>
        <a href="${updateUrl}" style="display:inline-block;background:#d9534f;color:#fff;padding:12px 20px;
                  border-radius:6px;text-decoration:none;font-weight:bold;">📝 Update Address Details</a>
        <p style="margin-top:15px;">Or copy this link:</p>
        <p><a href="${updateUrl}" target="_blank">${updateUrl}</a></p>
        <p style="margin-top:20px;">Thanks,<br/>Dispatch Logistics Team<br/>Email: ${process.env.EMAIL_FROM}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Dispatch Logistics" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject,
      html,
    });

    return res.json({
      ok: true,
      message: "Update address email sent successfully",
      data: { order_id, email_sent: true, update_url: updateUrl }
    });

  } catch (err) {
    console.error("❌ Error in sending address update mail:", err);
    return res.status(500).json({ ok: false, message: "Failed to send address update mail", error: err.message });
  }
};
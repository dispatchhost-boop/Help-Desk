const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransporter({
            host: 'smtp.dispatch.co.in', // Replace with your SMTP host
            port: 587,
            secure: false,
            auth: {
                user: 'onboarding@dispatch.co.in',
                pass: process.env.EMAIL_PASSWORD // Set this in your environment variables
            }
        });
    }

    async sendAddressVerificationEmail(customerData) {
        const { email, name, address, pincode } = customerData;
        
        const mailOptions = {
            from: 'onboarding@dispatch.co.in',
            to: email,
            subject: 'Address Verification Required - Dispatch.co.in',
            html: this.generateVerificationTemplate(name, address, pincode)
        };

        try {
            const result = await this.transporter.sendMail(mailOptions);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('Email sending failed:', error);
            return { success: false, error: error.message };
        }
    }

    generateVerificationTemplate(name, address, pincode) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #007bff; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f9f9f9; }
                    .button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Dispatch.co.in</h2>
                    </div>
                    <div class="content">
                        <h3>Dear ${name},</h3>
                        <p>Thank you for choosing our services! To complete your onboarding process, we need to verify your address details.</p>
                        
                        <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h4>Your Address Details:</h4>
                            <p><strong>Address:</strong> ${address}</p>
                            <p><strong>Pincode:</strong> ${pincode}</p>
                        </div>

                        <p>Please verify that the above address details are correct. If everything looks good, no further action is needed.</p>
                        
                        <p>If you need to update your address, please contact our support team or login to your account to make changes.</p>
                        
                        <p>Best regards,<br>Dispatch.co.in Team</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated message. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
}

module.exports = new EmailService();
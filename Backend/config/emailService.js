const nodemailer = require("nodemailer");

/**
 * Creates a reusable nodemailer transporter.
 * Configure SMTP settings in .env:
 *   EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        // Force IPv4 if IPv6 is unreachable
        family: 4
    });
};

/**
 * Send employee credentials email.
 * Called when HR adds a new employee.
 */
const sendEmployeeCredentials = async ({ toEmail, fullName, employeeId, tempPassword, department, designation, joiningDate, company = "Nexi5" }) => {
    const transporter = createTransporter();

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 13px; }
        .body { padding: 32px 40px; }
        .greeting { font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 12px; }
        .text { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 24px; }
        .credentials-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px 24px; margin-bottom: 24px; }
        .credentials-box h3 { margin: 0 0 14px; font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
        .cred-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
        .cred-row:last-child { border-bottom: none; }
        .cred-label { font-size: 13px; color: #64748b; }
        .cred-value { font-size: 13px; font-weight: 700; color: #1e293b; font-family: monospace; }
        .cred-value.highlight { color: #6366f1; background: #ede9fe; padding: 2px 8px; border-radius: 4px; }
        .note { font-size: 12px; color: #94a3b8; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; }
        .footer { text-align: center; padding: 16px 40px; background: #f8fafc; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Nexi5 HRM</h1>
          <p>Your employee account has been created</p>
        </div>
        <div class="body">
          <p class="greeting">Hello ${fullName},</p>
          <p class="text">
            You have been added to the ${company} platform on Nexi5 HRM by HR. 
            Below are your login credentials and employee details.
            Please log in and change your password immediately.
          </p>
          
          <div class="credentials-box">
            <h3>🔑 Your Login Credentials</h3>
            <div class="cred-row">
              <span class="cred-label">Employee ID</span>
              <span class="cred-value highlight">${employeeId}</span>
            </div>
            <div class="cred-row">
              <span class="cred-label">Email</span>
              <span class="cred-value">${toEmail}</span>
            </div>
            <div class="cred-row">
              <span class="cred-label">Temporary Password</span>
              <span class="cred-value highlight">${tempPassword}</span>
            </div>
          </div>

          <div class="credentials-box">
            <h3>👤 Your Employee Details</h3>
            <div class="cred-row">
              <span class="cred-label">Department</span>
              <span class="cred-value">${department || "—"}</span>
            </div>
            <div class="cred-row">
              <span class="cred-label">Designation</span>
              <span class="cred-value">${designation || "—"}</span>
            </div>
            <div class="cred-row">
              <span class="cred-label">Joining Date</span>
              <span class="cred-value">${joiningDate || "—"}</span>
            </div>
          </div>

          <div class="note">
            ⚠️ This is a temporary password. Please change it after your first login 
            to keep your account secure.
          </div>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Nexi5 Technologies · This is an automated message. Please do not reply.
        </div>
      </div>
    </body>
    </html>
    `;

    try {
        await transporter.sendMail({
            from: `"${company} (Nexi5 HRM)" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `Welcome to ${company} — Your Login Credentials [${employeeId}]`,
            html,
        });
        console.log(`✅ Email sent successfully to ${toEmail}`);
    } catch (error) {
        console.error(`❌ Error sending email to ${toEmail}:`, error.message);
        throw error;
    }
};

module.exports = { sendEmployeeCredentials };

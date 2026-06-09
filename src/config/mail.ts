import nodemailer from "nodemailer";
import { env } from "./env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify().then(() => {
  console.log("✅ SMTP connection is ready");
}).catch((err) => {
  console.error("❌ SMTP connection failed:", err.message);
});

export async function sendResetPasswordEmail(
  email: string,
  name: string,
  token: string,
): Promise<void> {
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;

  const info = await transporter.sendMail({
    from: `"Warmindo POS" <${env.SMTP_USER}>`,
    to: email,
    subject: "Reset Password Akun Warmindo Anda",
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin:0;padding:0;background:#fefaf5;font-family:'Segoe UI',Arial,sans-serif">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fefaf5;padding:32px">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(120,80,40,0.08)">
                <tr>
                  <td style="background:linear-gradient(135deg,#92400e,#78350f);padding:36px 32px;text-align:center">
                    <table cellpadding="0" cellspacing="0" style="margin:0 auto">
                      <tr>
                        <td style="background:rgba(255,255,255,0.15);border-radius:12px;padding:8px 20px;text-align:center">
                          <h1 style="margin:0;color:#ffffff;font-size:28px;letter-spacing:2px;font-weight:800">WARMINDO</h1>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:10px 0 0;color:#fef3c7;font-size:13px;font-weight:500">Warung Makan Indonesia</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:36px 32px 28px">
                    <h2 style="margin:0 0 6px;color:#451a03;font-size:18px;font-weight:700">Halo ${name},</h2>
                    <p style="margin:0 0 20px;color:#78350f;font-size:14px;line-height:1.7">
                      Kami menerima permintaan reset password untuk akun Warmindo Anda. Klik tombol di bawah ini untuk membuat password baru:
                    </p>
                    <table cellpadding="0" cellspacing="0" style="margin:28px 0">
                      <tr>
                        <td align="center">
                          <a href="${resetUrl}" style="display:inline-block;padding:14px 40px;background:#78350f;color:#ffffff;text-decoration:none;border-radius:10px;font-size:14px;font-weight:700;box-shadow:0 4px 12px rgba(120,53,15,0.25)">Reset Password</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 4px;color:#a16207;font-size:12px;line-height:1.6">
                      Link ini berlaku selama <strong style="color:#78350f">1 jam</strong>. Jika Anda tidak meminta reset password, abaikan email ini.
                    </p>
                    <hr style="border:none;border-top:1.5px solid #fef3c7;margin:28px 0 16px">
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="text-align:center">
                          <p style="margin:0;color:#a16207;font-size:11px;font-weight:500">Warmindo POS &mdash; Warung Makan Indonesia</p>
                          <p style="margin:4px 0 0;color:#d4a574;font-size:10px">Ini adalah email otomatis, jangan membalas email ini.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });

  console.log(`📧 Reset password email sent to ${email}: ${info.messageId}`);
}

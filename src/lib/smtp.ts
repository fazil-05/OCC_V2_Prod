import nodemailer from "nodemailer";

export type OtpEmailPurpose = "REGISTER" | "RESET_PASSWORD";

export async function sendOtpEmail(params: {
  to: string;
  code: string;
  purpose: OtpEmailPurpose;
}) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    throw new Error("SMTP env vars are not configured");
  }

  // Gmail app passwords never contain whitespace; some users paste with spaces.
  const sanitizedPass = SMTP_PASS.replace(/\s+/g, "");

  const port = Number(SMTP_PORT);
  const secure = port === 465;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
    auth: {
      user: SMTP_USER,
      pass: sanitizedPass,
    },
  });

  const subject =
    params.purpose === "REGISTER"
      ? "Your OCC registration OTP"
      : "Your OCC password reset OTP";

  const text =
    `Your 6-digit OTP is: ${params.code}\n\n` +
    `It will expire in 10 minutes.\n\n` +
    `If you didn't request this, you can ignore this email.`;

  await transporter.sendMail({
    from: SMTP_FROM,
    to: params.to,
    subject,
    text,
  });
}


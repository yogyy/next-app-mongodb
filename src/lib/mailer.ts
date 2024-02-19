import User from "@/models/usermodel";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

type EmailType = "VERIFY" | "RESET";
interface SendEmail {
  email: string;
  emailType: EmailType;
  userId: string;
}
export const sendEmail = async ({ email, emailType, userId }: SendEmail) => {
  try {
    const token = await bcrypt.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: token,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    }
    await User.findByIdAndUpdate(userId, {
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: Date.now() + 3600000,
    });

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: "hitesh@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verify?token=${token}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }
            or copy and paste the link below in your browser. <br> ${
              process.env.DOMAIN
            }/verify?token=${token}
            </p>`,
    };
    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

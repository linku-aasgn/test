import { Resend } from "resend";
import verificationEmailTemplate from "../emails/verificationEmailTemplate";    
const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendVerificationEmail(email: string, name: string, otp: string) {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
        to: email,
        subject: "Your OTP for verification (valid for 30 minutes)",
        react: verificationEmailTemplate({ name, otp }),

    })
}
catch (error) {
    console.log("Error sending verification email:", error);
    throw error;
  }
}

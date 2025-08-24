import { Html, Body, Container, Text, Head, Preview } from "@react-email/components";
interface verificationEmailTemplateProps  {
  name: string;
  otp: string;
}
export default function verificationEmailTemplate({ name, otp }: verificationEmailTemplateProps) {
    return (
    <Html>
      <Head />
      <Preview>Your OTP for verification (valid for 30 minutes)</Preview>
      <Body style={{ backgroundColor: "#f9f9f9", fontFamily: "Arial, sans-serif" }}>
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "24px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
          }}
        >
          <Text style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>
            Hi {name}, 👋
          </Text>
          <Text style={{ fontSize: "16px", marginBottom: "16px" }}>
            Use the OTP below to verify your email:
          </Text>
          <Text
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              textAlign: "center",
              margin: "12px 0",
            }}
          >
            {otp}
          </Text>
          <Text style={{ fontSize: "14px", color: "#555", marginTop: "16px" }}>
            ⚠️ This OTP is valid for <b>30 minutes</b>.  
            Do not share it with anyone.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

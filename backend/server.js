import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.options("*", cors());

// Gmail API endpoint (HTTPS)
const GMAIL_API_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

// Base64URL encoding helper
function encodeMessage(message) {
  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

app.post("/send-email", async (req, res) => {
  const { company, companyKana, person, personKana, email, phone, inquiry } = req.body;

  try {
    const message = [
      `From: ${process.env.GMAIL_SENDER}`,
      `To: ${process.env.GMAIL_SENDER}`,
      `Reply-To: ${email}`,
      "Subject: 新しいお問い合わせが届きました",
      "",
      `会社名: ${company}`,
      `会社名（フリガナ）: ${companyKana}`,
      `担当者名前: ${person}`,
      `担当者名前（フリガナ）: ${personKana}`,
      `メールアドレス: ${email}`,
      `電話番号: ${phone}`,
      "",
      "お問い合わせ内容:",
      inquiry
    ].join("\n");

    const rawMessage = encodeMessage(message);

    // Gmail API call using App Password (HTTPS)
    const response = await axios.post(
      GMAIL_API_URL,
      { raw: rawMessage },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.GMAIL_SENDER}:${process.env.GMAIL_APP_PASSWORD}`
          ).toString("base64")}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ success: true });

  } catch (error) {
    console.error("Email sending failed:", error.response?.data || error.message);
    res.json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
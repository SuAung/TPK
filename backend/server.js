import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.options("*", cors());

// Gmail App Password transporter (HTTPS, not SMTP ports)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_SENDER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

app.post("/send-email", async (req, res) => {
  const { company, companyKana, person, personKana, email, phone, inquiry } = req.body;

  try {
    const mailOptions = {
      from: process.env.GMAIL_SENDER,
      to: process.env.GMAIL_SENDER,
      replyTo: email,
      subject: "新しいお問い合わせが届きました",
      text: `
会社名: ${company}
会社名（フリガナ）: ${companyKana}
担当者名前: ${person}
担当者名前（フリガナ）: ${personKana}
メールアドレス: ${email}
電話番号: ${phone}

お問い合わせ内容:
${inquiry}
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true });

  } catch (error) {
    console.error("Email sending failed:", error);
    res.json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

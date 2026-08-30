import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors()); // VERY IMPORTANT
app.use(express.json());

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-email", async (req, res) => {
  const { company, companyKana, person, personKana, email, phone, inquiry } = req.body;

  try {
    const result = await resend.emails.send({
      from: "TPKホームお問い合わせ <noreply@onresend.com>",
      to: "susuaung87@gmail.com",
      reply_to: email,
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
    });

    console.log("Email sent:", result);
    res.json({ success: true });

  } catch (error) {
    console.error("Email sending failed:", error);
    res.json({ success: false });
  }
});

// Render uses PORT environment variable
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

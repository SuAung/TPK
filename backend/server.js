const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-email", async (req, res) => {
    console.log("Received data:", req.body);
    const {
        company,
        companyKana,
        person,
        personKana,
        email,
        phone,
        inquiry
    } = req.body;

    console.log("Attempting to send email...");
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "susuaung87@gmail.com", /* Add an email that was used to create app pass code */
            pass: "aygb zncw vttv secc" /* App passcode here */
        }
    });

    const mailOptions = {
        from: `"TPKホームお問い合わせ" <susuaung87@gmail.com>`,
        replyTo: email, /* Used to reply the inquiry */
        to: "susuaung87@gmail.com", /* Change the receiver email address here */
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


    try {

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
        res.json({ success: true });
    } catch (error) {
        console.error("Email sending failed:", error);
        res.json({ success: false, error });
    }
});


app.listen(3000, () => console.log("Backend running on port 3000"));

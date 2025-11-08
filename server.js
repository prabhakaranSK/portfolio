import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://portfolio-web-mocha-eta.vercel.app/"],
    methods: ["POST"],
  })
);

app.post("/api/sendMail", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const ownerMailOptions = {
      from: `"Portfolio Contact" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: `New Portfolio Message:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

    const userMailOptions = {
      from: `"Prabhakaran Portfolio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Message Received Successfully!",
      text: `Hello ${name},\n\nThank you for reaching out! Your message has been sent successfully.\n\nPlease wait — I’ll get back to you soon.\n\nBest regards,\nPrabhakaran`,
    };

    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(userMailOptions);

    console.log("Emails sent successfully!");
    res.json({ success: true, message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

app.get("/", (req, res) => {
  res.send("Portfolio Backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

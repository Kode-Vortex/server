// utils/nodemailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "harshverma8433@gmail.com", 
      pass: "rvkc lcvw adso fzqv", 
    },
});

export const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: "harshverma8433@gmail.com",
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
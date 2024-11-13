import nodemailer from "nodemailer";

const sendMail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.MAIL_APP_PASSWORD,
      },
    });

    // Define the email options
    const mailOptions = {
      from: {
        name: "Charles Tunga Shopping List App",
        address: process.env.USER_MAIL,
      }, // sender address
      to: options.userMail, // recipient address
      subject: "Send email using nodemailer and gmail", // Subject line
      text: "Your password reset token (valid for 10 min)", // plain text body
      html: `<b>${options.message}</b>`, // HTML body (adjust if you need dynamic HTML content)
      // attachments: [], // Attachments if needed
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export default sendMail;

import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = async (options) => {
  try {
    // Initialize MailerSend with API key
    const mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY,
    });

    // Define sender and recipient details
    const sentFrom = new Sender("calebcharles34@gmail.com", "Admin");
    const recipients = [new Recipient(options.userMail, options.userName)];

    // Set up email parameters
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(options.mailSubject)
      .setHtml(`<p><strong>Token:</strong> ${options.message}</p>`)
      .setText(options.message);

    // Send the email
    await mailerSend.email.send(emailParams);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export default mailerSend;

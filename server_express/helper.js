import nodemailer from "nodemailer";
import Feedback from "./schema/feedBackSchema.js";

// Create a transporter for sending emails using nodemailer with Gmail service
export const emailService = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "mandalapuajay2001@gmail.com",
    pass: "vynhpwsngkcezaxz",
  },
});

// Function to send emails with dynamic content based on the parameters provided
export const sendEmail = (
  SentToEmail,
  approveByEmail,
  status,
  userType,
  title,
) => {
  // Define the email options including sender, recipient, subject, and HTML content
  const mailOptions = {
    from: "mandalapuajay2001@gmail.com",
    to: SentToEmail,
    subject: `Question Paper ${status}`,
    html: `
          <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 30px; font-family: Arial, sans-serif;">
            <h1 style="color: #B3D23E; text-align: center; margin-bottom: 20px; animation: fadeIn 1s ease-in-out;">✨ Question Paper ${status} - ${title} ✨</h1>
            <p style="color: #555555; line-height: 1.5; animation: slideInLeft 1s ease-in-out;">👋 Dear Recipient,</p>
            <p style="color: #555555; line-height: 1.5; animation: slideInRight 1s ease-in-out;">📢 This is to inform you that the question paper has been ${status} by ${approveByEmail}.</p>
            <p style="color: #555555; line-height: 1.5; animation: slideInLeft 1s ease-in-out;">🔍 Please review the ${status} question paper and take necessary actions.</p>
            ${userType === "examinationOfficer" ? `<p style="color: ${status === "Approved" ? "#B3D23E" : "#FF0000"}; line-height: 1.5; animation: slideInRight 1s ease-in-out;"><strong>Your paper ${title} is ${status} for the exam.</strong></p>` : ""}
            <p style="color: #555555; line-height: 1.5; margin-top: 30px; animation: fadeIn 1s ease-in-out;">✍️ Best regards,<br>Your Team</p>
          </div>
        `,
  };
  // Send the email using the defined transporter and log the result
  emailService.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`${status} Email send to :`, { SentToEmail });
    }
  });
};

// Function to create feedback entries in the database using the Feedback model
export const createFeedBack = async (
  approvals,
  createdBy,
  review,
  title,
  feedBackFrom,
  userType,
) => {
  try {
    // Create a new feedback document
    const feedback = new Feedback({
      approvals: approvals,
      createdBy: createdBy,
      review: review,
      title: title,
      feedBackFrom: feedBackFrom,
      userType: userType,
    });
    // Save the feedback document to the database
    await feedback.save();
  } catch (error) {
    console.error("Error sending email or creating feedback:", error);
  }
};

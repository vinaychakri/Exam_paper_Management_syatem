// Importing mongoose to interact with MongoDB
import mongoose from "mongoose";

// Destructuring Schema from mongoose
const { Schema } = mongoose;

// Defining the schema for feedback
const feedbackSchema = new Schema({
  approvals: { type: Number, required: true }, // Number of approvals
  createdBy: { type: String, required: true }, // ID of the user who created the feedback
  review: { type: String, required: true }, // Text content of the review
  title: { type: String, required: true }, // Title of the feedback
  feedBackFrom: { type: String, required: true }, // ID of the user from whom the feedback was received
  userType: { type: String, required: true }, // Type of user (e.g., student, teacher)
  createdAt: { type: Date, default: Date.now }, // Timestamp when the feedback was created
  updatedAt: { type: Date, default: Date.now }, // Timestamp when the feedback was last updated
});

// Creating a model from the schema
const Feedback = mongoose.model("Feedback", feedbackSchema);

// Exporting the Feedback model for use in other parts of the application
export default Feedback;

// Importing mongoose and a plugin for timestamps
import mongoose from "mongoose";
import timestamp from "mongoose-timestamp";

// Destructuring Schema and model from mongoose for use in schema definitions
const { Schema, model } = mongoose;

// Schema for individual options in a question
const optionSchema = new Schema({
  option: { type: String }, // Text of the option
});

// Schema for tracking approvals by specific users
const approvalSchema = new Schema({
  approvedEmail: { type: String, default: "Not approved" }, // Email of the approver
  approvedUserType: { type: String, default: "Not approved" }, // Type of the approver (e.g., admin, professor)
});

// Main schema for a question
const questionSchema = new Schema({
  id: { type: Number, required: true }, // Unique identifier for the question
  type: { type: String, enum: ["MCQ", "Paragraph"], required: true }, // Type of the question (Multiple Choice or Paragraph)
  title: { type: String, required: true }, // Title of the question
  question: { type: String, required: true }, // The question text itself
  options: [optionSchema], // Array of options if the question is MCQ
  correctAnswer: { type: String }, // Correct answer to the question
  marks: { type: Number, required: true }, // Marks awarded for the correct answer
  image: [{ type: String }], // Array of image URLs associated with the question
  rubrics: [{ type: String }], // Rubrics for grading the question
});

// Schema for a collection of submitted questions
const submittedQuestionsSchema = new Schema({
  questions: [questionSchema], // Array of questions
  userId: { type: String, required: true }, // ID of the user who submitted the questions
  userEmail: { type: String, required: true }, // Email of the user who submitted the questions
  departments: [{ type: String, required: true }], // Departments associated with the questions
  approvals: { type: Number, default: 0 }, // Number of approvals the submission has received
  approvedBy: [approvalSchema], // Array of approvals detailing who approved
});

// Applying the timestamp plugin to the submittedQuestionsSchema to add createdAt and updatedAt fields automatically
submittedQuestionsSchema.plugin(timestamp);

// Creating a model from the submittedQuestionsSchema
const SubmittedQuestionsModel = model(
  "SubmittedQuestions",
  submittedQuestionsSchema,
);

// Exporting the model for use in other parts of the application
export default SubmittedQuestionsModel;

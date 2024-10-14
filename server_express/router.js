// Importing necessary modules and controllers
import express from "express";
import Multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import {
  UserGoogleSignup,
  UserGoogleSignIn,
  emailUserVerification,
  getUserInformation,
  updateUserDepartments,
  passwordVerification,
  verifyPassword,
  updatePassword
} from "./controllers/users.js";
import {
  addQuestionController,
  getQuestionsController,
  updateQuestionApprovals,
  updateQuestionDecline,
  getCurrentApprovalsController,
  deleteQuestion,
  updateQuestionPaper
} from "./controllers/questions.js";
import {
  createFeedback,
  getFeedbackById,
  deleteFeedback,
} from "./controllers/feedback.js";

// Initialize express router
const route = express.Router();

// User routes
route.post("/users/signup", UserGoogleSignup); // Route for user signup
route.post("/users/signin", UserGoogleSignIn); // Route for user signin
route.get("/verify/:token", emailUserVerification); // Route for email verification
route.get("/users/information/:id", getUserInformation); // Route to get user information
route.put("/users/updateDepartments", updateUserDepartments); // Route to update user departments

// Question routes
route.post("/addQuestions", addQuestionController); // Route to add questions
route.get("/allQuestions", getQuestionsController); // Route to get all questions
route.put("/approval", updateQuestionApprovals); // Route to update question approvals
route.put("/decline", updateQuestionDecline); // Route to decline question
route.get("/getApprovalsById/:id", getCurrentApprovalsController); // Route to get current approvals by ID
route.delete("/removeQuestionPaper/:id", deleteQuestion); // Route to delete a question paper
route.put("/updateQuestionPaper", updateQuestionPaper); // Route to update a question paper

// Feedback routes
route.post("/addFeedBack", createFeedback); // Route to add feedback
route.get("/getFeedBackById/:id", getFeedbackById); // Route to get feedback by ID
route.delete("/removeFeedBack/:id", deleteFeedback); // Route to delete feedback

// Password routes
route.post("/forgot", passwordVerification); // Route for password verification
route.get("/reset/:id", verifyPassword); // Route to verify password
route.post("/newPassword", updatePassword); // Route to update password

// Export the configured routes
export default route;

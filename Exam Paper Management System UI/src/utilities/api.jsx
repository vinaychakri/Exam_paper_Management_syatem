import axios from "axios";

// Base URL for API requests
const BASE_URL = "http://localhost:7777";

// Generic API function to handle requests
const api = async (method, endpoint, data) => {
  const url = `${BASE_URL}/${endpoint}`; // Construct the full URL
  const response = await axios[method](url, data); // Make the API call using axios
  return response; // Return the response from the API
};

// Function to register a user with email
export const registerWithEmail = async (data) =>
  api("post", "users/signup", data);

// Function to log in a user with email
export const loginWithEmail = async (data) => api("post", "users/signin", data);

// Function to retrieve user information by ID
export const getUserInformation = async (id) =>
  api("get", `users/information/${id}`);

// Function to update user departments
export const updateUserDepartments = async (data) =>
  api("put", "users/updateDepartments", data);

// Function to add questions
export const addQuestions = async (data) => api("post", "addQuestions", data);

// Function to retrieve all questions
export const getAllQuestion = async () => api("get", "allQuestions");

// Function to add feedback
export const addFeedBack = async (data) => api("post", "addFeedBack", data);

// Function to get feedback by ID
export const getFeedById = async (id) => api("get", `getFeedBackById/${id}`);

// Function to remove feedback by ID
export const removeFeedBack = async (id) =>
  api("delete", `removeFeedBack/${id}`);

// Function to update approval status
export const approvalStatus = async (data) => api("put", "approval", data);

// Function to update decline status
export const declineStatus = async (data) => api("put", "decline", data);

// Function to get current approvals by ID
export const getCurrentApprovals = async (id) =>
  api("get", `getApprovalsById/${id}`);

// Function to handle forgotten email scenarios
export const forgotEmail = async (data) => api("post", "forgot", data);

// Function to update password
export const updatePassword = async (data) =>
  api("post", "updatePassword", data);

// Function to remove a question paper by ID
export const removeQuestionPaper = async (id) =>
  api("delete", `removeQuestionPaper/${id}`);

// Function to update a question paper
export const updateQuestionPaper = async (data) =>
  api("put", "updateQuestionPaper", data);

// Function to handle new password creation
export const newPasswordEndpoint = async (data) =>
  api("post", "newPassword", data);

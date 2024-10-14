import mongoose from "mongoose";

// Destructuring Schema from mongoose object
const { Schema } = mongoose;

// Define the schema for a Google User
const userSchema = new Schema({
  name: { type: String, required: true }, // Full name of the user
  given_name: { type: String, required: true }, // Given name (first name)
  family_name: { type: String, required: true }, // Family name (last name)
  picture: { type: String, required: true }, // URL to the user's profile picture
  email: { type: String, required: true }, // Email address of the user
  password: { type: String, default: "Google account user", required: true }, // Password (default set for Google users)
  email_verified: { type: Boolean, default: false }, // Status of email verification
  createdAt: { type: Date, default: Date.now }, // Timestamp of user creation
  userType: { type: String, default: "professor" }, // Type of user (default is "professor")
  profileUpdated: { type: Boolean, default: false }, // Flag to check if profile has been updated
  verificationToken: { type: String, default: "google verified user" }, // Token for verifying the user
  departments: [{ type: String }], // List of departments associated with the user
});

// Create a model from the schema
const GoogleUser = mongoose.model("Google User", userSchema);

// Export the model
export default GoogleUser;

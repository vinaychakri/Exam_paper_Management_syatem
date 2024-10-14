import express from "express"; // Importing Express framework
import cors from "cors"; // Importing CORS to allow cross-origin requests
import mongoose from "mongoose"; // Importing Mongoose for MongoDB interactions
import route from "./router.js"; // Importing routes from router.js
import dotenv from "dotenv"; // Importing dotenv to manage environment variables

dotenv.config(); // Loading environment variables from .env file

const server = express(); // Creating an instance of Express

const port = process.env.PORT; // Retrieving the port number from environment variables
// ANSI escape codes for colors
const green = "\x1b[32m"; // Green color code
const red = "\x1b[31m"; // Red color code
const reset = "\x1b[0m"; // Reset color code

// Unicode characters for decoration
const checkMark = "✔"; // Check mark symbol
const crossMark = "❌"; // Cross mark symbol

// Function to create formatted console messages with borders and colors
function createBeautifulMessage(message, symbol, color) {
  const length = message.length + 4; // Calculate the length for the border based on message length
  const border = "-".repeat(length); // Create a border with dashes
  return `${color}${border}\n${symbol}  ${message}  ${symbol}\n${border}${reset}`; // Return the formatted message
}

// CORS configuration options
const corsOptions = {
  origin: "*", // Allow all origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed methods
  preflightContinue: false, // Do not use preflight continuation
  optionsSuccessStatus: 204, // Status to return for successful OPTIONS requests
  allowedHeaders: "Content-Type, Authorization", // Headers that are allowed
  exposedHeaders: ["Content-Range", "X-Content-Range"], // Headers that are exposed to the browser
};

server.use(cors(corsOptions)); // Applying CORS middleware to the server
server.use(express.json()); // Middleware to parse JSON bodies
server.use("/", route); // Setting the base route to use the imported routes

// Connecting to the MongoDB database
mongoose
  .connect(process.env.DB)
  .then(() => {
    const successMessage = `Database connected successfully`; // Success message
    console.log(createBeautifulMessage(successMessage, checkMark, green)); // Log success message in a formatted way
  })
  .catch((error) => {
    const errorMessage = `Database connection failed: ${error}`; // Error message
    console.log(createBeautifulMessage(errorMessage, crossMark, red)); // Log error message in a formatted way
  });

// Starting the server on the specified port
server.listen(port, () => {
  const serverMessage = `Server started at: http://localhost:${port}/`; // Server start message
  console.log(createBeautifulMessage(serverMessage, checkMark, green)); // Log server start message in a formatted way
});

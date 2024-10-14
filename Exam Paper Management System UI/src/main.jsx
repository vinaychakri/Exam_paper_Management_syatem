// Importing React library
import React from "react";
// Importing ReactDOM for rendering React components
import ReactDOM from "react-dom/client";
// Importing the main App component
import App from "./App.jsx";
// Importing MantineProvider for theming support from Mantine
import { MantineProvider } from "@mantine/core";
// Importing custom theme settings
import { theme } from "./theme.js";
// Importing base styles for Mantine components
import "@mantine/core/styles.css";
// Importing specific styles for Loader component from Mantine
import "@mantine/core/styles/Loader.css";
// Importing GoogleOAuthProvider for Google OAuth functionality
import { GoogleOAuthProvider } from "@react-oauth/google";

// Rendering the application into the 'root' DOM element
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="67909571347-ik18eas3h5inbgpr9h392eeva0hp19uk.apps.googleusercontent.com">
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);

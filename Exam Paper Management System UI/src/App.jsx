// Importing CSS for the entire application
import "./App.css";
// Importing components from react-router-dom for routing
import { BrowserRouter, Route, Routes } from "react-router-dom";
// Importing components for different pages
import UpdateProfile from "./components/updateProfile/UpdateProfile";
import { AuthenticationForm } from "./components/Auth/AuthenticationForm";
import Dashboard from "./components/Dashboard";
import Questions from "./components/Questions";
import { ResetPassword } from "./components/Auth/ResetPassword";
import { NavbarMinimalColored } from "./components/NavBar/NavbarMinimalColored";
// Hook for accessing the current location in the router
import { useLocation } from "react-router-dom";
import {Info} from "./components/Info";
import CustomToaster from "./utilities/CustomToaster";

// Component that defines the routing logic for the app
const AppRouter = () => {
  // Using the useLocation hook to get the current location
  const location = useLocation();
  // Logic to determine if the Navbar should be displayed
  const shouldShowNavbar = !location.pathname.includes("/changePassword");
  

  // Returning the main container that includes the Navbar and Routes
  return (
    <div className="main-container">
      {/* Conditionally rendering the Navbar based on the current route */}
      {shouldShowNavbar && <NavbarMinimalColored />}
      {/* Defining Routes for different components based on the path */}
      <Routes>
        <Route path="/updateProfile" element={<UpdateProfile />} />
        <Route path="/authentication" element={<AuthenticationForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/yourQuestions" element={<Questions />} />
        <Route path="/changePassword/:id" element={<ResetPassword />} />
        <Route path="/info" element={<Info />} />
      </Routes>
    </div>
  );
};

// Main App component that includes the BrowserRouter
export default function App() {
  return (
    <>
    <CustomToaster/>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
    </>
  );
}

import React, { useState } from "react";
import { newPasswordEndpoint } from "../../utilities/api";
import { useNavigate } from "react-router-dom";
import { isPasswordComplex } from "../../utilities/helper";
import { Button, PasswordInput, Text } from "@mantine/core";
import toast from "react-hot-toast";

// Component for resetting user password
export const ResetPassword = () => {
  const [passwordFields, setPasswordFields] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const { newPassword, confirmPassword } = passwordFields;
  const [formErrors, setFormErrors] = useState({});
  const navigateTo = useNavigate();

  // Handles input changes and updates state
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPasswordFields({ ...passwordFields, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  // Extracts userId from URL
  const userId = window.location.pathname.split("/").pop();

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    // Password length validation
    if (newPassword.length < 8) {
      validationErrors.newPassword =
        "Password must be at least 8 characters long";
    }

    // Password match validation
    if (newPassword !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    // Password complexity validation
    if (!isPasswordComplex(newPassword)) {
      validationErrors.newPassword =
        "Password must contain at least one uppercase letter, one lowercase letter, and one digit";
    }

    // Check if there are any errors
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    // API call to update password
    newPasswordEndpoint({ userId, newPassword })
      .then((res) => {
        setPasswordFields({
          newPassword: "",
          confirmPassword: "",
        });
        toast.success(res.data.message);
        if (res.data.message === "Password successfully updated") {
          navigateTo("/authentication");
        }
      })
      .catch((error) => {
        toast.error(error.response.data.errorMessage);
      });
  };

  return (
    <>
      <h2>Reset Your password</h2>
      <form onSubmit={handleSubmit}>
        <PasswordInput
          required
          label="New Password"
          placeholder="Enter new password"
          radius="md"
          onChange={handleInputChange}
          name="newPassword"
          value={newPassword}
          error={formErrors.newPassword}
        />
        {formErrors.newPassword && (
          <Text color="red">{formErrors.newPassword}</Text>
        )}
        <PasswordInput
          required
          label="Confirm New Password"
          placeholder="Confirm new password"
          radius="md"
          onChange={handleInputChange}
          name="confirmPassword"
          value={confirmPassword}
          error={formErrors.confirmPassword}
        />
        {formErrors.confirmPassword && (
          <Text color="red">{formErrors.confirmPassword}</Text>
        )}
        <Button className="btn btn-danger" type="submit">
          Change Password
        </Button>
      </form>
    </>
  );
};

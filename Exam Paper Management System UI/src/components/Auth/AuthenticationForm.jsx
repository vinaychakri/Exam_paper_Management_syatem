// Importing necessary components and hooks from libraries and local files
import {
  TextInput,
  PasswordInput,
  Text,
  Group,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
} from "@mantine/core";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleButton } from "./GoogleButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allowUser, verifyUser } from "../../utilities/localStorage";
import { useStore } from "../../store/store";
import {
  loginWithEmail,
  registerWithEmail,
  forgotEmail,
} from "../../utilities/api";
import { useState } from "react";
import { isPasswordComplex } from "../../utilities/helper";
import { toast } from "react-hot-toast";

// Component for handling authentication forms
export const AuthenticationForm = () => {
  const [authType, setAuthType] = useState("login"); // State to toggle between login and register
  const { userRegister, setUserRegister } = useStore(); // Using store to manage user state

  const routeNavigate = useNavigate(); // Hook for navigation
  const { given_name, family_name, email, password, terms } = userRegister; // Destructuring user details from state

  // Function to toggle between authentication types
  const handleToggleAuthType = (type) => {
    setAuthType(type);
  };

  // Function to handle input changes and update state
  const handleInputs = (event) => {
    const { name, value } = event.target;
    setUserRegister({ ...userRegister, [name]: value });
  };

  // Function to handle successful Google sign-in
  async function handleGoogleSignInSuccess(tokenResponse) {
    const accessToken = tokenResponse?.access_token;
    try {
      await handleGoogleAuth(accessToken, "signin");
    } catch (error) {
      toast.error(error.response.data.errorMessage);
    }
  }

  // Function to handle successful Google sign-up
  async function handleGoogleSignUpSuccess(tokenResponse) {
    const accessToken = tokenResponse?.access_token;
    try {
      await handleGoogleAuth(accessToken, "signup");
    } catch (error) {
      toast.error(error.response.data.errorMessage);
    }
  }

  // General function to handle Google authentication
  async function handleGoogleAuth(accessToken, action) {
    if (!accessToken) return;

    let endpoint = "";
    if (action === "signin") {
      endpoint = "signin";
    } else if (action === "signup") {
      endpoint = "signup";
    } else {
      toast.error("Invalid action provided.");
    }

    const res = await axios.post(`http://localhost:7777/users/${endpoint}`, {
      googleAccessToken: accessToken,
    });
    allowUser(res.data.user);
    const verifiedUser = verifyUser();

    const userType = verifiedUser?.user?.userType;
    if (userType === "professor") {
      routeNavigate(
        res.data.user.profileUpdated ? "/dashboard" : "/updateProfile",
      );
    } else if (userType === "examinationOfficer") {
      routeNavigate(
        res.data.user.profileUpdated ? "/questions" : "/updateProfile",
      );
    }
  }

  // Hooks for Google login and signup
  const GoogleSignUp = useGoogleLogin({ onSuccess: handleGoogleSignUpSuccess });
  const GoogleSignIn = useGoogleLogin({ onSuccess: handleGoogleSignInSuccess });

  // Function to handle registration form submission
  const submitRegisterForm = (event) => {
    event.preventDefault();
    if (
      !given_name.length ||
      !family_name.length ||
      !email.length ||
      !password.length ||
      !terms
    ) {
      toast.error("please enter all the user details");
    } else if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    } else if (!isPasswordComplex(password)) {
      toast.error(
        "Password must contain at least one uppercase letter, one lowercase letter, and one digit",
      );
      return;
    } else {
      registerWithEmail(userRegister)
        .then((response) => {
          setUserRegister({
            given_name: "",
            family_name: "",
            email: "",
            password: "",
            terms: false,
          });
          toast.success(response.data.message);
        })
        .catch((error) => {
          toast.error(error.response.data.errorMessage);
        });
    }
  };

  // Function to handle login form submission
  const submitLoginForm = async (event) => {
    event.preventDefault();

    if (!email.length || !password.length) {
      toast.error("Please enter all user details.");
      return;
    }

    try {
      const response = await loginWithEmail({ email, password });
      allowUser(response.data.user);
      const userType = verifyUser()?.user?.userType;

      if (userType === "professor" || userType === "examinationOfficer") {
        if (!response.data.user.profileUpdated) {
          routeNavigate("/updateProfile");
        } else {
          if (userType === "professor") {
            routeNavigate("/dashboard");
          } else if (userType === "examinationOfficer") {
            routeNavigate("/test");
          }
        }
      } else {
        toast.error("Invalid user type.");
      }
    } catch (error) {
      toast.error(error.response.data.errorMessage);
    }
  };

  // Function to handle forgot password form submission
  const submitForgotForm = (event) => {
    event.preventDefault();
    forgotEmail({ email })
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.errorMessage);
      });
  };

  // Rendering the form based on the authentication type
  return (
    <div className="authentication2">
      <div className="authentication">
        <Text size="md" weight={500}>
          Welcome to Paper Management System, {authType} with
        </Text>
        <Group grow mb="md" mt="md">
          {authType === "register" ? (
            <GoogleButton radius="xl" onClick={() => GoogleSignUp()}>
              Google sign up
            </GoogleButton>
          ) : (
            <GoogleButton radius="xl" onClick={() => GoogleSignIn()}>
              Google sign in
            </GoogleButton>
          )}
        </Group>

        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />
        <form
          onSubmit={
            authType === "register"
              ? submitRegisterForm
              : authType === "login"
                ? submitLoginForm
                : submitForgotForm
          }
        >
          <Stack>
            {authType === "forgot" ? (
              <TextInput
                required
                label="Forgot Email"
                placeholder="hello@gmaill.com"
                radius="md"
                onChange={handleInputs}
                name="email"
                value={email}
              />
            ) : (
              <></>
            )}
            {authType === "register" && (
              <Group grow mb="md" mt="md">
                <TextInput
                  required
                  label="First name"
                  placeholder="Your name"
                  radius="md"
                  onChange={handleInputs}
                  name="given_name"
                  value={given_name}
                />
                <TextInput
                  required
                  label="Last name"
                  placeholder="Your name"
                  radius="md"
                  onChange={handleInputs}
                  name="family_name"
                  value={family_name}
                />
              </Group>
            )}
            {authType != "forgot" && (
              <>
                <TextInput
                  required
                  label="Email"
                  placeholder="hello@gmaill.com"
                  radius="md"
                  onChange={handleInputs}
                  name="email"
                  value={email}
                />
                <PasswordInput
                  required
                  label="Password"
                  placeholder="Your password"
                  radius="md"
                  onChange={handleInputs}
                  name="password"
                  value={password}
                />
              </>
            )}

            {authType === "register" && (
              <Checkbox
                checked={terms}
                onChange={(e) =>
                  setUserRegister({ ...userRegister, terms: e.target.checked })
                }
                label="I accept terms and conditions"
              />
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              onClick={() =>
                handleToggleAuthType(
                  authType === "register" ? "login" : "register",
                )
              }
              size="xs"
            >
              {authType === "register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Anchor
              component="button"
              type="button"
              onClick={() => handleToggleAuthType("forgot")}
              size="xs"
            >
              Forgot Password?
            </Anchor>
            <Button type="submit" radius="xl">
              {authType === "register"
                ? "Register"
                : authType === "login"
                  ? "Login"
                  : "Forgot"}
            </Button>
          </Group>
        </form>
      </div>
    </div>
  );
};

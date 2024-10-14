import axios from "axios";
import GoogleUser from "../schema/googleUserSchema.js";
import jwt from "jsonwebtoken";
import { jwtSecret, jwtExpire } from "../config/default.js";
import { promisify } from "util";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { emailService } from "../helper.js";

// Function to handle Google user signup
export async function UserGoogleSignup(req, res) {
  // Check if Google access token is provided in the request
  if (req.body.googleAccessToken) {
    const { googleAccessToken } = req.body;
    // Fetch user information from Google API
    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      })
      .then(async (response) => {
        const {
          name,
          given_name,
          family_name,
          picture,
          email,
          email_verified,
        } = response.data;
        // Check if user already exists in the database
        const existingUser = await GoogleUser.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            errorMessage: "Email already exists. Please login instead.",
          });
        }
        // Create new user with fetched Google data
        const result = new GoogleUser({
          name,
          given_name,
          family_name,
          picture,
          email,
          email_verified,
        });
        await result.save();
        const user = await GoogleUser.findOne({ email });
        const payload = {
          user: {
            _id: user._id,
          },
        };
        // Sign JWT for the user
        const sign = promisify(jwt.sign);
        const token = await sign(payload, jwtSecret, { expiresIn: jwtExpire });

        const { _id: userId, userType, profileUpdated } = user;
        // Send successful response with user data and token
        res.json({
          message: `Registered successfully`,
          token,
          user: { _id: userId, email, userType, profileUpdated },
        });
      })
      .catch((err) => {
        res.status(400).json({ message: "Invalid access token!" });
      });
  } else {
    try {
      const { given_name, family_name, email, password } = req.body;
      const verificationToken = crypto.randomBytes(20).toString("hex");
      const existingUser = await GoogleUser.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          errorMessage: "Email already exists. Please login instead.",
        });
      }
      // Create new user with provided data and hashed password
      const emailUser = new GoogleUser({
        name: given_name + " " + family_name,
        given_name,
        family_name,
        picture: "default picture URL",
        email,
        email_verified: false,
        verificationToken,
      });
      const salt = await bcrypt.genSalt(10);
      emailUser.password = await bcrypt.hash(password, salt);

      await emailUser.save();
      // Prepare and send verification email
      const mailOptions = {
        from: "mandalapuajay2001@gmail.com",
        to: email,
        subject: "Account Verification ",
        html: `<div style="max-width: 500px; margin: 0 auto; text-align: center; padding: 20px; background-color: #f8f8f8; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <p style="color: #333; font-size: 24px; font-weight: bold; margin-bottom: 20px;">Welcome to Our Community!</p>
        
        <p style="color: #555; font-size: 16px; margin-bottom: 30px;">
            Thank you for joining our community! To ensure the security of your account, please click the link below to verify your email address:
        </p>
        
        <a href="http://localhost:7777/verify/${verificationToken}" style="display: inline-block; padding: 15px 30px; background-color: #80bd9e; color: #fff; text-decoration: none; border-radius: 5px; font-size: 18px; transition: background-color 0.3s;">
            Verify Your Email
        </a>
    
        <p style="color: #555; font-size: 16px; margin-top: 30px;">
            If the above button doesn't work, you can also copy and paste the following link into your browser:
            <br />
            <code style="background-color: #eee; padding: 5px; border-radius: 3px; font-size: 14px; word-break: break-all;">http://localhost:7777/verify/${verificationToken}</code>
        </p>
    
        <p style="color: #777; font-size: 14px; margin-top: 20px;">
            Note: This link will expire in 24 hours for security reasons. If you did not create an account with us, please ignore this email.
        </p>
    </div>
    `,
      };
      emailService.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(" ✔ Email Sent ✔");
        }
      });
      // Send successful registration response
      res.json({
        message: `Registered successfully, please verify your email: ${email}`,
      });
    } catch (err) {
      res.status(500).json({
        errorMessage: "Failed to register. Please try again later.",
      });
    }
  }
}

// Function to verify email user
export const emailUserVerification = async (req, res) => {
  const verificationToken = req.params.token;
  try {
    const user = await GoogleUser.findOne({ verificationToken });

    if (user) {
      user.email_verified = true;
      user.verificationToken = "user verified";
      await user.save();
      // Redirect to authentication page after successful verification
      res.redirect("http://localhost:5173/authentication");
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

// Function to handle Google user sign-in
export async function UserGoogleSignIn(req, res) {
  // Check if Google access token is provided in the request
  if (req.body.googleAccessToken) {
    const { googleAccessToken } = req.body;
    // Fetch user information from Google API
    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      })
      .then(async (response) => {
        const email = response.data.email;
        const user = await GoogleUser.findOne({ email });

        if (!user) {
          return res.status(401).json({
            errorMessage: "Invalid email ",
          });
        }
        if (user.email_verified === false) {
          return res.status(401).json({
            errorMessage: "please verify your google Email not verified",
          });
        }
        const payload = {
          user: {
            _id: user._id,
          },
        };
        // Sign JWT for the user
        const sign = promisify(jwt.sign);
        const token = await sign(payload, jwtSecret, { expiresIn: jwtExpire });

        const { _id: userId, userType, profileUpdated, departments } = user;
        // Send successful sign-in response with user data and token
        res.json({
          token,
          user: { _id: userId, email, userType, profileUpdated, departments },
        });
      })
      .catch((err) => {
        res.status(400).json({ message: "Invalid access token!" });
      });
  } else {
    try {
      const { email, password } = req.body;
      const user = await GoogleUser.findOne({ email });

      if (!user) {
        return res.status(401).json({
          errorMessage: "Invalid email ",
        });
      }
      if (user.email_verified === false) {
        return res.status(401).json({
          errorMessage: "Please verify email",
        });
      }
      // Check if provided password matches the stored hash
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({
          errorMessage: "Invalid password",
        });
      }
      const payload = {
        user: {
          _id: user._id,
        },
      };
      // Sign JWT for the user
      const sign = promisify(jwt.sign);
      const token = await sign(payload, jwtSecret, { expiresIn: jwtExpire });

      const { _id: userId, userType, profileUpdated, departments } = user;
      // Send successful login response with user data and token
      res.json({
        message: `login successfully`,
        token,
        user: { _id: userId, email, userType, profileUpdated, departments },
      });
    } catch (err) {
      res.status(500).json({
        errorMessage: "Failed to log in. Please try again later.",
      });
    }
  }
}

// Function to get user information by ID
export const getUserInformation = async (req, res) => {
  const id = req.params.id;
  try {
    // Retrieve user information from the database
    const user = await GoogleUser.find({ _id: id });
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

// Function to update user departments
export const updateUserDepartments = async (req, res) => {
  const { selectedDepartments, profileUpdated, userId } = req.body;

  console.log(selectedDepartments, profileUpdated, userId);
  try {
    // Find user by ID and update their departments
    const user = await GoogleUser.findById({ _id: userId }).exec();
    if (!user) {
      return res.status(404).json({
        message: "User not found to update",
      });
    }
    user.departments = selectedDepartments;
    user.profileUpdated = true;
    await user.save();
    // Send successful department update response
    res.json({
      message: `Department Updated`,
      departments: { departments: selectedDepartments },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Function to handle password verification request
export const passwordVerification = async(req, res) =>{
  try {
    const { email } = req.body;
    console.log(email);

    const user = await GoogleUser.findOne({ email : email });

    if (!user) {
      return res.status(401).json({
        errorMessage: "Invalid email ",
      });
    }

    const UserEmail = user.email;

    // Prepare and send password reset email
    const mailOptions = {
      from: "anushagowda673@gmail.com",
      to: UserEmail,
      subject: "Password Reset",
      html: `<div style="max-width: 500px; margin: 0 auto; text-align: center; padding: 20px; background-color: #f8f8f8; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
              <p style="color: #333; font-size: 24px; font-weight: bold; margin-bottom: 20px;">Password Reset Request</p>
              
              <p style="color: #555; font-size: 16px; margin-bottom: 30px;">
                  We received a request to reset your password. To proceed with the password reset, please click the link below:
              </p>
              
              <a href="http://localhost:7777/reset/${user._id}" style="display: inline-block; padding: 15px 30px; background-color: #80bd9e; color: #fff; text-decoration: none; border-radius: 5px; font-size: 18px; transition: background-color 0.3s;">
                  Reset Password
              </a>
          
              <p style="color: #555; font-size: 16px; margin-top: 30px;">
                  If the above button doesn't work, you can also copy and paste the following link into your browser:
                  <br />
                  <code style="background-color: #eee; padding: 5px; border-radius: 3px; font-size: 14px; word-break: break-all;">http://localhost:9887/reset/${user._id}</code>
              </p>
          
              <p style="color: #777; font-size: 14px; margin-top: 20px;">
                  Note: This link will expire in 1 hour for security reasons. If you did not request a password reset, please ignore this email.
              </p>
          </div>`,
    };

    emailService.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          errorMessage: "Failed to send email.",
        });
      } else {
        console.log("Email sent to : " ,user.email);
      }
    });
    // Send successful password reset email response
    res.json({ message: "Password reset email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      errorMessage: "Failed to reset password. Please try again later.",
    });
  }
}

// Function to verify password reset link
export const verifyPassword = async (req, res) => {
  const id = req.params.id;
  try {
    // Find user by ID and redirect to password change page if found
    const user = await GoogleUser.findOne({ _id: id });
    if (user) {
      res.redirect(`http://localhost:5173/changePassword/${id}`);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

// Function to update a user's password
export const updatePassword = async (req, res) => {
  const { userId, newPassword } = req.body;
  console.log("Updating password for user ID:", userId);

  try {
    // Retrieve user from database
    const user = await GoogleUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a salt and hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save the updated user information
    await user.save();

    // Send successful password update response
    res.json({ message: "Password successfully updated" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

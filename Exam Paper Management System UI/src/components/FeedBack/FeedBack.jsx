import React, { useState } from "react";
import { useStore } from "../../store/store";
import { verifyUser } from "../../utilities/localStorage";
import { Button, Stack, Textarea } from "@mantine/core";
import { addFeedBack } from "../../utilities/api";
import toast from "react-hot-toast";

// Component for handling user feedback submission
export const FeedBack = ({ approvals, createdBy, title, controller }) => {
  // Accessing feedback state from the global store
  const { feedback, setFeedback } = useStore();
  const { review } = feedback;
  // State to handle review input errors
  const [reviewError, setReviewError] = useState("");
  // Verifying user and extracting user details
  const verifiedUser = verifyUser();
  const feedBackFrom = verifiedUser?.user?.email;
  const userType = verifiedUser.user?.userType;

  // Handles changes in the review input field
  const handleInputChange = (data) => {
    setFeedback({ ...feedback, [data.target.name]: data.target.value });
    setReviewError("");
  };

  // Validates the review form before submission
  const validateForm = () => {
    if (review.trim() === "") {
      setReviewError("Please enter your review.");
      return false;
    }
    return true;
  };

  // Submits the user's comment to the backend
  const submitUserComment = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const feedBackData = {
        approvals,
        createdBy,
        review,
        title,
        feedBackFrom,
        userType,
      };
      addFeedBack(feedBackData)
        .then((res) => {
          // Clearing the review field on successful submission
          setFeedback({
            review: "",
          });
          controller(); // Callback function to update parent component
          toast.success(res.data.message);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  };

  return (
    <Stack>
      <Textarea
        label="Review"
        name="review"
        value={review}
        onChange={handleInputChange}
        placeholder="Please Enter your review"
        autosize
        minRows={2}
      />
      {reviewError && <div className="error">{reviewError}</div>}
      <Button onClick={submitUserComment}> add Review </Button>
    </Stack>
  );
};

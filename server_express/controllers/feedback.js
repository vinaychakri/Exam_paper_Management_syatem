import Feedback from "../schema/feedBackSchema.js"; // Import Feedback model
import GoogleUser from "../schema/googleUserSchema.js"; // Import GoogleUser model

// Controller to create a new feedback entry
export const createFeedback = async (req, res) => {
  try {
    // Destructure required fields from request body
    const { approvals, createdBy, review, title, feedBackFrom, userType } =
      req.body;

    // Create a new feedback document
    const feedback = new Feedback({
      approvals,
      createdBy,
      review,
      title,
      feedBackFrom,
      userType,
    });

    // Save the feedback document to the database
    await feedback.save();
    // Send a success response
    res.json({ message: "Thanks for Feedback!" });
  } catch (err) {
    // Handle errors and send error response
    res.status(400).json({ message: err.message });
  }
};

// Controller to retrieve all feedback entries
export const getFeedbacks = async (req, res) => {
  try {
    // Fetch all feedback documents from the database
    const feedbacks = await Feedback.find();
    // Send feedback data in response
    res.json(feedbacks);
  } catch (err) {
    // Handle errors and send error response
    res.status(500).json({ message: err.message });
  }
};

// Controller to retrieve feedback by title
export const getFeedbackById = async (req, res) => {
  try {
    // Find feedback by title provided in URL parameters
    const feedbacks = await Feedback.find({ title: req.params.id });
    // Fetch user images associated with each feedback
    const userImages = await Promise.all(
      feedbacks.map(async (feedback) => {
        const user = await GoogleUser.findOne({ email: feedback.feedBackFrom });
        return user ? user.picture : null;
      }),
    );

    // Format feedback data with user images
    const formattedFeedbacks = feedbacks.map((feedback, index) => ({
      _id: feedback._id,
      approvals: feedback.approvals,
      createdBy: feedback.createdBy,
      review: feedback.review,
      title: feedback.title,
      feedBackFrom: feedback.feedBackFrom,
      userType: feedback.userType,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
      picture: userImages[index],
    }));

    // Check if feedbacks are found, if not send 404 response
    if (!feedbacks.length) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Send formatted feedback data in response
    res.json(formattedFeedbacks);
  } catch (err) {
    // Handle errors and send error response
    res.status(500).json({ message: err.message });
  }
};

// Controller to update a feedback entry
export const updateFeedback = async (req, res) => {
  try {
    // Update feedback document based on ID and new data provided in request
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    // Check if feedback was found and updated, if not send 404 response
    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    // Send updated feedback data in response
    res.json(updatedFeedback);
  } catch (err) {
    // Handle errors and send error response
    res.status(400).json({ message: err.message });
  }
};

// Controller to delete a feedback entry
export const deleteFeedback = async (req, res) => {
  try {
    // Delete feedback document based on ID provided in URL parameters
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    // Check if feedback was found and deleted, if not send 404 response
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    // Send success response
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    // Handle errors and send error response
    res.status(500).json({ message: err.message });
  }
};

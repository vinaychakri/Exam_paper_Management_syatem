import SubmittedQuestionsModel from "../schema/questionsSchema.js";
import GoogleUser from "../schema/googleUserSchema.js";
import { sendEmail, createFeedBack } from "../helper.js";

// Controller to handle the addition of new questions
const addQuestionController = async (req, res) => {
  try {
    // Extracting data from request body
    const { questions, userId, userEmail, departments, rubrics } = req.body;
    const all = { questions, userId, userEmail, departments, rubrics }
    console.log("HERE",all);
    
    // Creating a new document instance for submitted questions
    const submittedQuestions = new SubmittedQuestionsModel({
      questions: questions.map((question) => ({
        id: question.id,
        type: question.type,
        title: question.title,
        question: question.question,
        options: question.options.map((option) => ({ option })),
        correctAnswer: question.correctAnswer,
        marks: question.marks,
        image: question.image,
        rubrics: rubrics
      })),
      userId,
      userEmail,
      departments,
    });

    // Saving the submitted questions to the database
    await submittedQuestions.save();

    // Sending a success response
    res.json({ message: "Questions added successfully!" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to add questions. Please try again later." });
  }
};

// Controller to retrieve all questions with user images
const getQuestionsController = async (req, res) => {
  try {
    // Fetching all questions from the database
    const allQuestions = await SubmittedQuestionsModel.find().lean();

    // Fetching user images for each question
    const userImages = await Promise.all(
      allQuestions.map(async (question) => {
        const user = await GoogleUser.findOne({ email: question.userEmail });
        return user ? user.picture : null;
      }),
    );
    // Combining questions with their corresponding user images
    const questionsWithImages = allQuestions.map((question, index) => ({
      ...question,
      picture: userImages[index],
    }));

    // Sending the combined data as a response
    res.json({ allQuestions: questionsWithImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to get all questions. Please try again later.",
    });
  }
};

// Controller to update question approvals
const updateQuestionApprovals = async (req, res) => {
  try {
    // Extracting data from request body
    const { id, userEmail, userType, approvalIncrease } = req.body;
    const submittedQuestion = await SubmittedQuestionsModel.findById(id);

    // Checking if the question exists
    if (!submittedQuestion) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Checking if the user has already approved the question
    const userApproval = submittedQuestion.approvedBy.find(
      (approval) => approval.approvedEmail === userEmail,
    );

    if (userApproval) {
      return res
        .status(400)
        .json({ message: "You have already approved this question." });
    }

    // Creating a new approval entry
    const newApproval = {
      approvedEmail: userEmail,
      approvedUserType: userType,
    };
    const previousApprovals = submittedQuestion.approvedBy.length;

    // Adding the new approval to the question
    submittedQuestion.approvedBy.push(newApproval);
    submittedQuestion.approvals = approvalIncrease + 1;
    const isUpdated = await submittedQuestion.save();
    if (isUpdated && submittedQuestion.approvedBy.length > previousApprovals) {
      // Sending an email notification for the approval
      sendEmail(
        submittedQuestion.userEmail,
        userEmail,
        "Approved",
        newApproval.approvedUserType,
        submittedQuestion.questions[0].title,
      );
      // Creating feedback for the approval
      createFeedBack(
        submittedQuestion.approvals,
        submittedQuestion.userEmail,
        `Question Paper "${submittedQuestion.questions[0].title}" Approved`,
        submittedQuestion.questions[0].title,
        userEmail,
        userType,
      );
    }
    // Sending a success response
    res.json({ message: "Question approvals updated successfully." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        message: "Failed to update question approvals. Please try again later.",
      });
  }
};

// Controller to handle the decline of question approvals
const updateQuestionDecline = async (req, res) => {
  try {
    // Extracting data from request body
    const { id, userEmail, userType, approvalReduce } = req.body;
    const submittedQuestion = await SubmittedQuestionsModel.findById(id);

    // Checking if the question exists
    if (!submittedQuestion) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Checking if the user has approved the question before declining
    const userDecline = submittedQuestion.approvedBy.find(
      (decline) => decline.approvedEmail === userEmail,
    );

    if (!userDecline) {
      return res.status(400).json({ message: "You need to approve it first." });
    }

    const previousApprovals = submittedQuestion.approvedBy.length;
    const indexToRemove = submittedQuestion.approvedBy.findIndex(
      (user) => user.approvedEmail === userEmail,
    );

    // Removing the approval from the question
    if (indexToRemove !== -1) {
      submittedQuestion.approvedBy.splice(indexToRemove, 1);
    }
    submittedQuestion.approvals = approvalReduce - 1;
    const isUpdated = await submittedQuestion.save();
    if (isUpdated && submittedQuestion.approvedBy.length < previousApprovals) {
      // Sending an email notification for the decline
      sendEmail(
        submittedQuestion.userEmail,
        userEmail,
        "Decline",
        userType,
        submittedQuestion.questions[0].title,
      );
      // Creating feedback for the decline
      createFeedBack(
        submittedQuestion.approvals,
        submittedQuestion.userEmail,
        `Question Paper "${submittedQuestion.questions[0].title}" DisApproved`,
        submittedQuestion.questions[0].title,
        userEmail,
        userType,
      );
    }
    // Sending a success response
    res.json({ message: "Question decline updated successfully." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        message: "Failed to update question approvals. Please try again later.",
      });
  }
};

// Controller to get current approvals for a specific question
const getCurrentApprovalsController = async (req, res) => {
  try {
    // Extracting question ID from request parameters
    const id = req.params.id;
    const allQuestions = await SubmittedQuestionsModel.find({ _id: id });
    // Fetching user images for each approval
    const userImages = await Promise.all(
      allQuestions[0].approvedBy.map(async (emails) => {
        const user = await GoogleUser.findOne({ email: emails.approvedEmail });
        return user ? user.picture : null;
      }),
    );
    // Sending the approvals data along with user images
    res.json({
      currentApprovals: allQuestions[0].approvals,
      currentApprovedBy: allQuestions[0].approvedBy,
      approvedImages: userImages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to get all questions. Please try again later.",
    });
  }
};

// Controller to delete a question
const deleteQuestion = async (req, res) => {
  try {
    // Deleting a question by ID
    const feedback = await SubmittedQuestionsModel.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Question not found" });
    }
    // Sending a success response for deletion
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to update a question paper
const updateQuestionPaper = async (req, res) => {
  try {
    // Extracting data from request body
    const { questionId, questions, userId, userEmail, departments, title, rubrics } = req.body;
    // Updating the question paper with new data
    const updatedQuestions = await SubmittedQuestionsModel.findByIdAndUpdate(
      questionId,
      {
        questions: questions.map((question) => ({
          id: question.id,
          type: question.type,
          title: title,
          question: question.question,
          options: question.options.map((option) => ({ option: option.option })),
          correctAnswer: question.correctAnswer,
          marks: question.marks,
          image: question.image,
          rubrics: rubrics
        })),
        userId,
        userEmail,
        departments,
      },
      { new: true }
    );

    if (!updatedQuestions) {
      return res.status(404).json({ message: "Questions not found" });
    }

    // Sending a success response for the update
    res.json({ message: "Questions updated successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to update questions. Please try again later." });
  }
};

// Export all controllers
export {
  addQuestionController,
  getQuestionsController,
  updateQuestionApprovals,
  updateQuestionDecline,
  getCurrentApprovalsController,
  deleteQuestion,
  updateQuestionPaper
};

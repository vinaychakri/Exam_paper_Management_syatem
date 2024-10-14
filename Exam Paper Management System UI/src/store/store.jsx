import { create } from "zustand";

// Create a store using Zustand, a state management library
export const useStore = create((set) => ({
  // State for user registration details
  userRegister: {
    given_name: "",
    family_name: "",
    email: "",
    password: "",
    terms: false,
  },
  // State for user login details
  userLogin: {
    email: "",
    password: "",
  },
  // State for storing feedback
  feedback: { review: "" },
  // Array to store user data information
  userDataInfo: [],
  // Array to store list of questions
  listOfQuestions: [],
  // Array to store list of feedback
  listOfFeedBack: [],
  // Array to manage various states
  stateManagement: [],
  // Function to update user registration details
  setUserRegister: (newUser) => set({ userRegister: newUser }),
  // Function to update user login details
  setLogin: (newLogin) => set({ userLogin: newLogin }),
  // Function to update user data information
  setUserDataInfo: (users) => set({ userDataInfo: users }),
  // Function to update list of questions
  setListOfQuestions: (question) => set({ listOfQuestions: question }),
  // Function to update feedback
  setFeedback: (comment) => set({ feedback: comment }),
  // Function to update list of feedback
  setListOfFeedBack: (feedback) => set({ listOfFeedBack: feedback }),
  // Function to update state management data
  setStateManagement: (newData) => set({ stateManagement: newData }),
}));

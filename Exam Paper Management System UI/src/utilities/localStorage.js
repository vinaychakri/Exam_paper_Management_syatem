// Add user to local storage
export const setUser = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true; // Return true on success
  } catch (error) {
    console.error("Error adding user to local storage:", error);
    return false; // Return false on error
  }
};

// Get user from local storage
export const getUser = (key) => {
  try {
    const userString = localStorage.getItem(key);
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("Error getting user from local storage:", error);
    return null;
  }
};

// Remove user from local storage
export const removeUser = (key) => {
  try {
    localStorage.removeItem(key);
    return true; // Return true on success
  } catch (error) {
    console.error("Error removing user from local storage:", error);
    return false; // Return false on error
  }
};

// Allow user (add user to local storage with "user" key)
export const allowUser = (user) => setUser("user", user);

// Verify user (get user from local storage with "user" key)
export const verifyUser = () => {
  const user = getUser("user"); // Assuming this retrieves user data from somewhere
  const departments = JSON.parse(localStorage.getItem("departments"));
  return { user, departments };
};

// Decline user (remove user from local storage with "user" key and execute next function)
export const logoutUser = (next) => {
  localStorage.removeItem("departments");
  const removed = removeUser("user");
  if (removed && typeof next === "function") {
    next();
  }
};

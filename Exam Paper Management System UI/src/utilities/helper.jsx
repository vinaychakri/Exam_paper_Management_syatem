// List of departments categorized by their respective fields
export const departmentsList = [
  // Arts and Humanities
  "Art History",
  "Classics",
  "English",
  "History",
  "Linguistics",
  "Philosophy",
  "Religious Studies",
  "Theater and Performance Studies",
  // Social Sciences
  "Anthropology",
  "Economics",
  "Geography",
  "Political Science",
  "Psychology",
  "Sociology",
  "Social Work",
  // Natural Sciences
  "Biology",
  "Chemistry",
  "Physics",
  "Environmental Science",
  "Geology",
  "Mathematics",
  "Statistics",
  // Engineering
  "Civil Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Computer Science and Engineering",
  "Chemical Engineering",
  "Aerospace Engineering",
  // Health Sciences
  "Medicine",
  "Nursing",
  "Public Health",
  "Pharmacy",
  "Dentistry",
  "Physical Therapy",
  "Occupational Therapy",
  // Business and Economics
  "Business Administration",
  "Accounting",
  "Finance",
  "Marketing",
  // Education
  "Education Administration",
  "Curriculum and Instruction",
  "Educational Psychology",
  "Special Education",
  "Counseling",
  // Law
  "Law School",
  "Legal Studies",
  // Communication and Media
  "Journalism",
  "Mass Communication",
  "Media Studies",
  "Public Relations",
  // Fine Arts
  "Studio Art",
  "Music",
  "Dance",
  "Theater Arts",
  // Information Technology
  "Computer Science",
  "Information Systems",
  "Cybersecurity",
  "Data Science",
  // Agriculture and Environmental Sciences
  "Agronomy",
  "Horticulture",
  "Forestry",
  "Environmental Studies",
  // Humanities and Social Sciences (Combined)
  "Interdisciplinary Studies",
  "Liberal Arts",
  "Cultural Studies",
  // Physical and Life Sciences (Combined)
  "Biophysics",
  "Biochemistry",
  "Biotechnology",
  // Multidisciplinary/Other
  "Global Studies",
  "Women's and Gender Studies",
  "Ethnic Studies",
];

// Function to capitalize each word in a string
export function capitalizeWords(str) {
  let words = str.split(/(?=[A-Z])/); // Split the string at each uppercase letter

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1); // Capitalize the first letter of each word
  }

  return words.join(" "); // Join the words back into a single string
}

// Function to check if a password meets complexity requirements
export const isPasswordComplex = (password) => {
  const hasUpperCase = /[A-Z]/.test(password); // Check for uppercase letters
  const hasLowerCase = /[a-z]/.test(password); // Check for lowercase letters
  const hasDigit = /\d/.test(password); // Check for digits
  return hasUpperCase && hasLowerCase && hasDigit; // Return true if all conditions are met
};

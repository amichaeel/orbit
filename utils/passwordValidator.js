const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push("Password must be at least 8 characters long");
  if (!/\d/.test(password)) errors.push("Password must contain a number");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("Password must contain a special character");
  return errors;
};

export default validatePassword;
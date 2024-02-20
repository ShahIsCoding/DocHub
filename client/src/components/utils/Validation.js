export const checkUserValidation = (payload) => {
  return isEmailValid(payload.username);
};
function isEmailValid(email) {
  console.log(email);
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  const [, domain] = email.split("@");
  const validHostnames = ["gmail.com", "yahoo.com"];
  return validHostnames.includes(domain);
}

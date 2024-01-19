const jwt = require("jsonwebtoken");
function getToken(id) {
  const token = jwt.sign({ data: id }, process.env.SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "10 days",
  });
  return token;
}
module.exports = {
  getToken,
};

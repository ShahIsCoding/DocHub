const jwt = require("jsonwebtoken");
const { handleError } = require("./errorUtils");

function getToken(id) {
  const token = jwt.sign({ data: id }, process.env.SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "1 days",
  });
  return token;
}
function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) next(handleError(401, "Unauthorized: No token provided"));

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err || decoded.data === undefined)
      next(handleError(401, "Unauthorized: Invalid token"));
    req.decoded = decoded;
    next();
  });
}

module.exports = {
  getToken,
  verifyToken,
};

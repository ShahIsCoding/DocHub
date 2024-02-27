const jwt = require("jsonwebtoken");
function getToken(id) {
  const token = jwt.sign({ data: id }, process.env.SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "1 days",
  });
  return token;
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    if (decoded.data === undefined)
      return res.status(401).json({ name: "Unauthorized: Invalid token" });
    req.decoded = decoded;
    next();
  });
}

module.exports = {
  getToken,
  verifyToken,
};

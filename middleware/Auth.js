const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) res.status(401).json({ message: "No token, Not Authourised" });
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.json({ message: "Token is Not Valid", err: err.message });
  }
};
module.exports = auth;

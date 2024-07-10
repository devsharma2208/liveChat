const jwt = require("jsonwebtoken");

const jwtVerification = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET_KEY, (err, decode) => {
    if (err) {
      return res.status(401).json({ status: false, message: "Invalid Token" });
    }
    req.userId = decode.userId;
    next();
  });
};

module.exports = { jwtVerification };

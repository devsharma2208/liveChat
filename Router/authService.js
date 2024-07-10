let express = require("express");
let bcrypt = require("bcryptjs");
const { userModel } = require("../Model/User/user");
const jwt = require("jsonwebtoken");
let authService = express.Router();

authService.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ status: false, message: "User already exists" });
  }
  try {
    const bcryptPass = await bcrypt.hash(password, 10);
    const user = new userModel({ username, email, password: bcryptPass });
    await user.save();
    res.status(201).json({
      status: true,
      message: "User Registered Successfully",
      result: { username, email, password: bcryptPass },
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Server error", result: err });
  }
});
authService.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials" });
    }

    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY
    );

    res.status(200).json({
      status: true,
      message: "Login successfully",
      result: { user, token: jwtToken },
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server error",
      result: err.message,
    });
  }
});

module.exports = { authService };

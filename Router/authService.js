let express = require("express");

let authService = express.Router();

authService.post("/register", (req, res) => {});

module.exports = { authService };

const express = require("express");
const dotenv = require("dotenv");
const { DataBaseConnection } = require("./DB/dataBase");
const { authService } = require("./Router/authService");

let app = express();
dotenv.config();
DataBaseConnection();

app.get("/", (req, res) => {
  res.status(201).json({ status: true, result: "Hello World" });
});

app.use("authService", authService);

app.listen(process.env.PORT, () => {
  console.log("Server is running " + process.env.PORT);
});

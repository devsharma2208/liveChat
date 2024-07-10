const express = require("express");
const dotenv = require("dotenv");
const { DataBaseConnection } = require("./DB/dataBase");
const { authService } = require("./Router/authService");
const { notificationService } = require("./Router/notificationService");
const bodyParser = require("body-parser");

let app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
DataBaseConnection();

app.get("/", (req, res) => {
  res.status(201).json({ status: true, result: "Hello World" });
});

app.use("/api", authService);
app.use("/api", notificationService);

app.listen(process.env.PORT, () => {
  console.log("Server is running " + process.env.PORT);
});

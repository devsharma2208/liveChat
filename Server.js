const express = require("express");

let app = express();
let port = 8082;

app.get("/", (req, res) => {
  res.status(201).json({ status: true, result: "Hello World" });
});

app.listen(port, () => {
  console.log("Server is running " + port);
});

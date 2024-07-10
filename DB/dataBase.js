let mongoose = require("mongoose");

function DataBaseConnection() {
  mongoose
    .connect(process.env.MONGODB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("conect to DB...");
    });
}

module.exports = { DataBaseConnection };

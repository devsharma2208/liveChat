let mongoose = require("mongoose");

function DataBaseConnection() {
  const uri = process.env.MONGODB_CONNECTION;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in the environment variables');
  }
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

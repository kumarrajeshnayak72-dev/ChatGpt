const mongoose = require("mongoose");

const connectToDb = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected To Db");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectToDb;
const mongoose =  require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      require: true,
    },
    lastname: String,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },

  password: String,
});

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;
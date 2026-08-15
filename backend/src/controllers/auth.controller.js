const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
  const {
    fullname: { firstname, lastname },
    password,
    email,
  } = req.body;

  const isUserExist = await userModel.findOne({ email });

  if (isUserExist) {
    res.status(401).json({
      message: "User Already Exist",
    });
  }

  const hashPassword =await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password: hashPassword,
  });

  const token = jwt.sign({id:user._id},process.env.SECRET_KEY);
  res.cookie("token",token)

  res.status(201).json({
    message:"User Reggistered Succcessfull"
  })
};

const loginUser =  async (req, res) => {
    const {email,password} = req.body;

    const user = await userModel.findOne({email});
    if(!user){
        res.status(401).json({
          message: "User Not Found",
        });
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password);

    if(!isPasswordCorrect){
        res.status(401).json({
          message: "Password Incorrect",
        });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    res.cookie("token",token);

    res.status(201).json({
      message: "User Login Successfull",
    });


}

module.exports = {
  registerUser,
  loginUser
};

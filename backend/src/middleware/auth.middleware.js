const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')

const authMiddleware = async (req,res,next) => {
  const {token} = req.cookies;

  if(!token){
    res.status(401).json({
      message: "Unauthorized User",
    });
  }

  try {
    const decoded = jwt.verify(token,process.env.SECRET_KEY)

    const user = await userModel.findById(decoded.id);
    req.user = user;
    next()
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized User",
    });
  }
}

module.exports = authMiddleware;
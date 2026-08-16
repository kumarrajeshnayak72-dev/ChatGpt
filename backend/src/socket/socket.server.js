const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const generateResponse = require('../services/ai.service')
const messageModel = require('../models/message.model')

const initializeSocket = (httpServer) => {
  const io = new Server(httpServer);

  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

      if (!cookies.token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(cookies.token, process.env.SECRET_KEY);

      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;

      next();
    } catch (error) {
      return next(new Error("Invalid or expired token"));
    }
  });


  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    

    socket.on("ai-message",async(data)=>{
        const response = await generateResponse(data.content)
        await messageModel.create({
          user: socket.user._id,
          chat: data.chat,
          content: data.content,
          role:"user"
        });

        socket.emit("ai-response",{response})
        await messageModel.create({
          user: socket.user._id,
          chat: data.chat,
          content: response,
          role: "model",
        });
        
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user._id);
    });
  });

  return io;
};

module.exports = initializeSocket;

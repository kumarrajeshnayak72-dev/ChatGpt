const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const {generateResponse, generateEmbaded} = require("../services/ai.service");
const {createMemory, queryMemory} =  require('../services/vector.service')
const messageModel = require('../models/message.model')

function initializeSocket(httpServer) {
  const io = new Server(httpServer);

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    if (!cookies.token) {
      return next(new Error("Authentication required"));
    }

    try {
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
    socket.on("ai-message", async (data) => {

      await messageModel.create({
        user:socket.user._id,
        chat:data.chat,
        content:data.content,
        role:"user"
      })

      const vectors = await generateEmbaded(data.content);
      console.log(vectors);
      

      const chatHistory = (await messageModel.find({
        chat:data.chat
      }).sort({createdAt : -1}).limit(20).lean()).reverse();

      // console.log(chatHistory);
      

      const response = await generateResponse(chatHistory.map(item => {
        return {
          role:item.role,
          parts:[{text:item.content}]
        }
      }));


      socket.emit("ai-response", {
        response,
      });
      await messageModel.create({
        user: socket.user._id,
        chat: data.chat,
        content: response,
        role: "model",
      });
    });
    
  });
}
module.exports = initializeSocket;

const chatModel = require('../models/chat.model')

const userChat = async (req,res) => {
    const {title} = req.body;

    const user = req.user;

   const chat =  await chatModel.create({
        user:user._id,
        title
    })

     return res.status(201).json({
       message: "Chat Created Successfully",
       chat,
     });

}

module.exports = userChat;
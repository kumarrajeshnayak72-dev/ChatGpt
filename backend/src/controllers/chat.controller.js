const chatModel = require('../models/chat.model')

async function createChat(req,res) {
    const {title} =  req.body;

    const user = req.user;

    const chat = await chatModel.create({
        user:user._id,
        title
    })

    res.json({
        message:"Chat Created Successfull",
        user
    })
}

module.exports = createChat
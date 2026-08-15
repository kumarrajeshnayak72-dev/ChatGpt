const express = require('express');
const app = express();
const cookie = require('cookie-parser')
const authRouter = require('./routes/auth.route')
const chatRouter = require('./routes/chat.route')

app.use(express.json());
app.use(cookie());

app.use("/api/auth",authRouter)
app.use("/api/chat", chatRouter);



module.exports = app;
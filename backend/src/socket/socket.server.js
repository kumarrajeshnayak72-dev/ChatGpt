const {Server} = require('socket.io');

async function initializeSocket(httpServer) {
    const io = new Server(httpServer);

    io.on("connection",(socket)=>{

    })
}
module.exports = initializeSocket
require("dotenv").config();
const app = require("./src/app");
const connectToDb = require("./src/db/db");
const { createServer } = require("http");
const initializeSocket = require("./src/socket/socket.server");

const httpServer = createServer(app);
initializeSocket(httpServer);

connectToDb();

httpServer.listen(3000, () => {
  console.log("Server Running on PORT 3000");
});

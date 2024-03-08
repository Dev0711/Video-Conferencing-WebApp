// const mediasoup = require("mediasoup");
const { mediasoupProcess } = require("./mediasoup");
const chatProcess = require("./chat");
// const moment = require('moment')


const socketConnection = async (meetSocket) => {
  meetSocket.on("connection", async (socket) => {
    console.log("A new socket has been connected; socketId -> ", socket.id);

    await mediasoupProcess(meetSocket, socket);

    chatProcess(meetSocket, socket)

  });
};

module.exports = { socketConnection };

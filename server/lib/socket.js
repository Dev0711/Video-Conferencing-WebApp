const mediasoup = require('mediasoup');
const { mediasoupProcess } = require('./mediasoup');

const socketConnection = async (socket) => {
  socket.on("connection", async (socket) => {
    console.log("A new socket has been connected; socketId -> ", socket.id);
    socket.on("message", (message) => {
      console.log(message);
      socket.send("helo there");
    });
    
    await mediasoupProcess(socket)
  });
};

module.exports = { socketConnection };
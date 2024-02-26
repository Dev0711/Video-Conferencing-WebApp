const moment = require("moment");

const chatProcess = (meetsocket, socket) => {

  socket.on("message", (msg, user, meetingId) => {
    console.log('message listened on server: ', msg);
    // io.to(meetingId).emit("message", msg, user, moment().format("h:mm a"));
    const time = moment().format("h:mm a");
    try {
        console.log(meetingId, msg, user, time);
        meetsocket.emit("message", msg, user, time);
        console.log('event emitted..');
    } catch (error) {
        console.error('Error emitting message event:', error);
    }
}); 
};

module.exports = chatProcess;

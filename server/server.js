const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000;
const cors = require('cors')
const mongoose = require('mongoose')
const { MONGODB_URI } = require('./config/dev')
const http = require('http')
const { Server } = require('socket.io')
const {socketConnection} = require('./lib/socket')



//Middlewares
app.use(cors())
app.use(express.json())

//Database connection -> Online
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDb!");
});
mongoose.connection.on("error", (err) => {
    console.log("Error on Connecting MongoDb!", err);
});

require("./models/user");

app.use(require("./routes/auth"));

//socket.io server 
const server = http.createServer(app)
const io = new Server(server)
const meetingconn = io.of('/meeting')

socketConnection(meetingconn)

server.listen(PORT, () => {
    console.log("Server is running on:", PORT);
});
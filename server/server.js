const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
// const fs = require("fs");
// const https = require("httpolyglot");
// const { MONGODB_URI } = require('./config/dev')
const http = require('http')
const { Server } = require("socket.io");
const { socketConnection } = require("./lib/socket");
const cookieParser = require("cookie-parser");
const verifyToken = require("./middleware/verifytoken");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");

app.use(express.json());

//Database connection -> Online
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// const options = {
//   key: fs.readFileSync("./ssl/key.pem", "utf-8"),
//   cert: fs.readFileSync("./ssl/cert.pem", "utf-8"),
// };

require("./models/user");

app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true,  // Allow credentials (cookies, headers, etc.)
// }))

app.use(cookieParser());

app.use(require("./routes/register"));
app.use(require("./routes/auth"));
app.use(require("./routes/refresh"));
app.use(require("./routes/logout"));
// app.use(verifyToken);
app.use(require("./routes/file"));
app.use('/files', require("./routes/download"));

//socket.io server
const socketOptions = {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
};

const server = http.createServer(app);
const io = new Server(server, socketOptions);
const socket = io.of("/meeting");

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDb!");
  server.listen(PORT, () => {
    console.log("Server is running on:", PORT);
  });
  socketConnection(socket)
});
mongoose.connection.on("error", (err) => {
  console.log("Error on Connecting MongoDb!", err);
});


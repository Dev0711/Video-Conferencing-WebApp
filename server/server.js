const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
require("dotenv").config();
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require("http");
const path = require("path");

const { socketConnection } = require("./lib/socket");
const verifyToken = require("./middleware/verifytoken");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");

//Database connection -> Online
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDb!");
  server.listen(PORT, () => {
    console.log("Server is running on:", PORT);
  });
  socketConnection(socket);
});
mongoose.connection.on("error", (err) => {
  console.log("Error on Connecting MongoDb!", err);
});

require("./models/user");

//socket.io server
const socketOptions = {
  cors: {
    origin: [process.env.ORIGIN, "http://localhost:8000", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
};

const server = http.createServer(app);
const io = new Server(server, socketOptions);
const socket = io.of("/meeting");

app.use(express.json());
app.use(credentials);
app.use(cors(corsOptions)); // Cross Origin Resource Sharing
app.use(cookieParser());

//Routes
app.use(require("./routes/register"));
app.use(require("./routes/verify_otp"));
app.use(require("./routes/auth"));
app.use(require("./routes/refresh"));
app.use(require("./routes/logout"));
// app.use(verifyToken);
app.use(require("./routes/file"));
app.use("/files", require("./routes/download"));
app.use(require("./routes/project"));

//serving the client side build
app.use(express.static(path.join(__dirname, "../client/build")));

// Catch all other routes and return the React index file
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000;
const cors = require('cors')
const mongoose = require('mongoose')
const { MONGODB_URI } = require('./config/dev')

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

app.listen(PORT, () => {
    console.log("Server is running on:", PORT);
});
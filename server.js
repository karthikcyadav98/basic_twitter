const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const path = require('path')

const users = require('./routes/api/users')
const tweets = require('./routes/api/tweets')

const app = express();

//bodyparser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json())

//mongodb connection and configuration
const db = require('./config/keys').mongoURI
mongoose
    .connect(db)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("Connection Falied", err))

//passport middleware
app.use(passport.initialize())

//passport config
require("./config/passport")(passport);

//Restful APIs
app.use("/api/users", users);
app.use("/api/tweets", tweets);


//Server static assets if in production
if (process.env.NODE_ENV === "production") {
    //Set Static folder
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

const port = process.env.PORT || 5000

app.listen(port, console.log("Server running on the port", port))
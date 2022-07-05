// Set up express server
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/public/`));

// Pull in config
const config = require("./config");

// Open in browser on start
const dotenv = require('dotenv').config();
const opn = require("opn");
opn(`http://localhost:${config.port}`);

// Pull in schema
const { User, Thread } = require("./persist/model");

// Pull in authentication and authorization
const setUpAuth = require("./auth");
const setUpSession = require("./session");

setUpSession(app);
setUpAuth(app);

app.post("/users", async (req, res) => {
    try {
        let user = await User.create({
            username: req.body.username,
            fullname: req.body.fullname,
            password: req.body.password,
        });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({
            message: `post request failed to create user`,
            error: err,
          });
    }
});


app.get("/thread/:id", (req, res) => {
    
});

app.get("/thread", (req, res) => {
    if (!req.user) {
        res.status(401).json({message: "Unauthorized"});
        return;
    }
});

app.post("/thread", async (req, res) => {
    // Auth
    if (!req.user) {
        res.status(401).json({message: "Unauthorized"});
        return;
    }
    // Create thread
    try {
        let thread = await Thread.create({
            user_id: req.user.id,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
        });
        res.status(201).json(thread)
    } catch (err) {
        res.status(500).json({message: "Failed to create thread"}, err)
    }
});

app.post("/post", (req, res) => {

});

app.delete("/thread/:id", (req, res) => {
    
});

app.delete("/thread/:thread_id/post/:post_id", (req, res) => {

});

module.exports = app;
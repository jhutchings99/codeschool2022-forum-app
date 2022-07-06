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


app.get("/thread/:id", async (req, res) => {
    let thread;
    // Get thread by id
    try {
        thread = await Thread.findById(req.params.id);
        if (!thread) {
            res.status(404).json({
                message: "thread not found"
            });
            return;
        }
    } catch (err) {
        res.status(500).json({
            message: `get request failed to get thread`,
            error: err,
        });
        return;
    }
    res.status(200).json(thread)
});

let threads = [];
app.get("/thread", async (req, res) => {
    // List all threads
    try {
        threads = await Thread.find({}, "-posts");
    } catch (err) {
        res.status(500).json({message: `get request failed to list threads`, err});
        console.log("messed up", err)
    }

    // Get all users for all the threads
    for (let k in threads) {
        threads[k] = threads[k].toObject();
        try {
            let user = await User.findById(threads[k].user_id, "-password");
            threads[k].user = user;
        } catch (err) {
            console.log('unable to get user')
        }
    }
    res.status(200).json(threads);
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

app.post("/post", async (req, res) => {
    // Check Auth
    if (!req.user) {
        res.status(401).json({message: "Unauthorized"});
        return;
    }

    let thread;

    try {
        thread = await Thread.findByIdAndUpdate(
            req.body.thread_id,
            {
                $push: {
                    posts: {
                        user_id: req.user.id,
                        body: req.body.body,
                        thread_id: req.body.thread_id
                    },
                }
            },
            {
                new: true,
            });
            if (!thread) {
                res.status(500).json({
                    message: `get request failed to get thread`,
                    error: err,
                });
                return;
            }
        res.status(201).json(thread.posts[thread.posts.length - 1])
    } catch (err) {
        res.status(500).json({message: "Failed to create post"}, err)
    }

    for (let k in thread.posts) {
        thread[k] = thread[k].toObject();
        try {
            let user = await User.findById(thread[k].user_id, "-password");
            thread[k].user = user;
        } catch (err) {
            console.log('unable to get user')
        }
    }
});

app.delete("/thread/:id", async (req, res) => {
        // Check Auth
        if (!req.user) {
            res.status(401).json({message: "Unauthorized"});
        }

        let thread; 
        
        try {
            thread = await Thread.findById(req.params.id);
        } catch (err) {
            res.status(500).json({
                message: `get request failed to get thread`,
                error: err,
            });
            return;
        }

        if (!thread) {
            res.status(404).json({
                message: "thread not found"
            });
            return;
        }

        if (req.user_id != thread.user_id) {
            res.status(403).json({message: "You do not own this thread"})
        }

        try {
            await Thread.findByIdAndDelete(req.params.id)
        } catch (err) { 
            res.status(500).json({message: "Failed to delete thread"})
        }

        res.status(200).json({message: "test"})
});

app.delete("/thread/:thread_id/post/:post_id", (req, res) => {

});

module.exports = app;
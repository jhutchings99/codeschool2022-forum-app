// Set up express server
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Pull in config
const config = require("./config");

// Open in browser on start
const dotenv = require('dotenv').config();
const opn = require("opn");
opn(`http://localhost:${config.port}`);

module.exports = app;
// Pull in dotenv
const dotenv = require("dotenv").config();

port = process.env.PORT || 5050;

module.exports = {
    port: port,
}
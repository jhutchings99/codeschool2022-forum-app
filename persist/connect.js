const mongoose = require('mongoose');
const db = mongoose.connection;

async function connect(user, pass) {
    let connectionString = `mongodb+srv://${user}:${pass}@cluster0.lyxopt8.mongodb.net/?retryWrites=true&w=majority`
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.log("error connecting to mongoose", err)
    }
}

function onConnect(callback) {
    db.once("open", () => {
        console.log("Mongo Connected");
        callback();
    });
}

module.exports = {
    connect,
    onConnect,
}
const session = require("express-session");

const setUpSessionStore = function (app) {
    app.use(session({
        secret: "codeschoolstuff",
        resave : false,
        saveUninitialized: false,
    }));
}

module.exports = setUpSessionStore
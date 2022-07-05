const passport = require("passport");
const LocalStrategy = require("passport-local");
const {User} = require("./persist/model");

passport.use(new LocalStrategy(async (username, password, done) => {
    let user;
    try {
        // try to find the user
        user = await User.findOne({"username":username, "password":password});
        if (!user) {
            done(null, false);
        }
        return done(null, user);
    } catch (err) {
        done(err);
    }
}));

const setUpAuth = function (app) {
    app.use(passport.initialize());
    app.use(passport.authenticate("session"));

    passport.serializeUser(function(user, cb){
        cb(null, {id: user._id, username: user.username});
    });
    passport.deserializeUser(function (user, cb){
        return cb(null, user);
    });

    app.post("/session", passport.authenticate("local"), (req, res) => {
        res.status(201).json({message: "successfuly authenticated", id: req.user.id});
    });

    app.get("/session", (req, res) => {
        if (!req.user) {
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        res.status(201).json({message: "Authorized", id: req.user.id});
    });
}

module.exports = setUpAuth
// Start express server
const app = require("./server");

// Pull in config
const config = require("./config");

// Pull in database
const {connect, onConnect} = require("./persist/connect")

onConnect(() => {
    var server = app.listen(config.port, () => {
        console.log(`Server is running on port ${config.port}`);
    });
});

connect(config.user, config.password);
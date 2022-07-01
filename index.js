// Start express server
const app = require("./server");

// Pull in config
const config = require("./config");

var server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
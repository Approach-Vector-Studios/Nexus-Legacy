const Shelljs = require("shelljs");
setTimeout(function () {
    Shelljs.exec("node Bot.js")
    process.exit();
}, 5000);
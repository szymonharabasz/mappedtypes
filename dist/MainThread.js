"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
var worker = child_process_1.fork("./dist/WorkerScript.js");
worker.on("message", function (e) {
    console.log(e);
});
worker.send({ type: 'sendMessageToThread', data: [10, "Hello world"] });

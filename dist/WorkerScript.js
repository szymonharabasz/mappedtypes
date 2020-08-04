"use strict";
exports.__esModule = true;
function processCommandFromMainThread(command) {
    switch (command.type) {
        case 'sendMessageToThread': {
            var _a = command.data, threadID = _a[0], message = _a[1];
            console.log(message);
            break;
        }
        case 'createThread': {
            var participants = command.data[0];
            console.log(participants);
            break;
        }
        case 'addUserToThread': {
            var _b = command.data, threadID = _b[0], userID = _b[1];
            console.log("Adding user ", userID, " to thread ", threadID);
            break;
        }
        case 'removeUserFromThread': {
            var _c = command.data, threadID = _c[0], userID = _c[1];
            console.log("Adding user ", userID, " to thread ", threadID);
            break;
        }
    }
}
process.on("message", function (e) {
    processCommandFromMainThread(e);
    process.exit();
});

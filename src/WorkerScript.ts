import { ThreadID, Message, Participants, UserID, SafeEmitter, Commands, Events } from './MainThread'

type Command =
    | { type: 'sendMessageToThread', data: [ThreadID, Message] }
    | { type: 'createThread', data: [Participants] }
    | { type: 'addUserToThread', data: [ThreadID, UserID] }
    | { type: 'removeUserFromThread', data: [ThreadID, UserID] }

let commandEmitter = new SafeEmitter<Commands>()
let eventEmitter = new SafeEmitter<Events>()

function processCommandFromMainThread(command: Command) {
    switch (command.type) {
        case 'sendMessageToThread': {
            let [threadID, message] = command.data
            console.log(message)
            break
        }
        case 'createThread': {
            let [participants] = command.data
            console.log(participants)
            break
        }
        case 'addUserToThread': {
            let [threadID, userID] = command.data
            console.log("Adding user ", userID, " to thread ", threadID)
            break
        }
        case 'removeUserFromThread': {
            let [threadID, userID] = command.data
            console.log("Adding user ", userID, " to thread ", threadID)
            break
        }
    }
}

process.on("message", command => {
    commandEmitter.emit(command.data.type, ...command.data.data)
})

eventEmitter.on("receivedMessage", data => {
    if (process.send) {
        process.send({ type: "receivedMessage", data })
    }
})

eventEmitter.on("createdThread", data => {
    if (process.send) {
        process.send({ type: "createdThread", data })
    }
})

eventEmitter.on("addedUserToThread", data => {
    if (process.send) {
        process.send({ type: "addedUserToThread", data })
    }
})

eventEmitter.on("removedUserFromThread", data => {
    if (process.send) {
        process.send({ type: "removedUserFromThread", data })
    }
})

commandEmitter.on("sendMessageToThread", (threadID, message) =>
    console.log(`OK, I will send a message to thread ${threadID}`)
)

eventEmitter.emit("createdThread", 123, [456, 789])
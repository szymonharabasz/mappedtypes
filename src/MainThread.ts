import { fork } from 'child_process';
import { EventEmitter } from "events";

export class SafeEmitter<Events extends Record<string | symbol, unknown[]>> {
    private emitter = new EventEmitter
    emit<K extends keyof Events>(
        channel: K,
        ...data: Events[K]
    ) {
        return this.emitter.emit(channel, ...data)
    }
    on<K extends keyof Events>(
        channel: K,
        listener: (...data: Events[K]) => void
    ) {
        return this.emitter.on(channel, listener)
    }
}

export type Message = string
export type ThreadID = number
export type UserID = number
export type Participants = UserID[]

export type Commands = {
    sendMessageToThread: [ThreadID, Message],
    createThread: [Participants],
    addUserToThread: [ThreadID, UserID],
    removeUserFromThread: [ThreadID, UserID]
}
export type Events = {
    receivedMessage: [ThreadID, UserID, Message],
    createdThread: [ThreadID, Participants],
    addedUserToThread: [ThreadID, UserID],
    removedUserFromThread: [ThreadID, UserID]
}

let commandEmitter = new SafeEmitter<Commands>()
let eventEmitter = new SafeEmitter<Events>()

let worker = fork("./dist/WorkerScript.js")
/*
worker.on("message", event => {
    eventEmitter.emit(event.type, ...event.data)
})
*/
commandEmitter.on("sendMessageToThread", data =>
    worker.send({ type: "sendMessageToThread", data })
)

commandEmitter.on("createThread", data =>
    worker.send({ type: "createThread", data })
)

commandEmitter.on("addUserToThread", data =>
    worker.send({ type: "addUserToThread", data })
)

commandEmitter.on("removeUserFromThread", data =>
    worker.send({ type: "removeUserFromThread", data })
)

eventEmitter.on("createdThread", (threadId, participants) =>
    console.log("Created a new thread!", threadId, participants)
)

commandEmitter.emit("createThread", [123, 456])
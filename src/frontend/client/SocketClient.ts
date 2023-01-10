import {io, Socket} from "socket.io-client";

export enum SocketEvent {
    CONNECT = "connect",
    DISCONNECT = "disconnect",
    CONNECT_ERROR = "connect_error",
}

class TaskEvent {
    event: SocketEvent;
    tasks: Array<SocketTask>;

    constructor(event: SocketEvent, task: SocketTask) {
        this.event = event;
        this.tasks = [task];
    }
}

export class SocketTask {
    name: string;
    task: (...args) => void;

    constructor(name: string, task: (...args) => void) {
        this.name = name;
        this.task = task;
    }
}

export class SocketClient{
    socket: Socket;
    listOfTask = Array<TaskEvent>();

    constructor() {

    }

    connectIo(){
        this.socket = io();
    }

    public addTask(name : string, event: SocketEvent, task: SocketTask){
        const taskEvent = this.listOfTask.find((task) => task.event === event);
        if(taskEvent){
            taskEvent.tasks.push(task);
        }else{
            const taskEvent = new TaskEvent(event,task);
            this._createSocketEvent(taskEvent);
        }
    }

    private _createSocketEvent(event: TaskEvent){
        this.listOfTask.push(event);
        this.socket.on(event.event, (args) => {
            event.tasks.forEach((task) => {
                task.task(args);
            })
        })
    }

    private _removeSocketEvent(event: TaskEvent){
        this.listOfTask.splice(this.listOfTask.indexOf(event),1);
        this.socket.off(event.event);
    }

    public removeTask(event: SocketEvent,name : string){
        const taskEvent = this.listOfTask.find((task) => task.event === event);
        if(taskEvent){
            const task = taskEvent.tasks.find((task) => task.name === name);
            if(task){
                taskEvent.tasks.splice(taskEvent.tasks.indexOf(task),1);
                if(taskEvent.tasks.length === 0){
                    this._removeSocketEvent(taskEvent);
                }
            }
        }
    }

}
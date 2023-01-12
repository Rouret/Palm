import {SocketClient, SocketEvent, SocketTask} from "../../../src/frontend/client/SocketClient";

describe("SocketClient", () => {
    test("Add Task", () => {
        const socketClient = new SocketClient();

        socketClient.addTask("test", SocketEvent.CONNECT, new SocketTask("test", () => console.log("test")));

        expect(socketClient.listOfTask.length).toBe(1);
        expect(socketClient.listOfTask[0].tasks.length).toBe(1);
        expect(socketClient.listOfTask[0].tasks[0].name).toBe("test");
        expect(socketClient.listOfTask[0].event).toBe(SocketEvent.CONNECT);
        expect(socketClient.socket.listeners(SocketEvent.CONNECT).length).toBe(1);
    })

    test("Add 2 Tasks", () => {
        const socketClient = new SocketClient();

        socketClient.addTask("test", SocketEvent.CONNECT, new SocketTask("test", () => console.log("test")));
        socketClient.addTask("test2", SocketEvent.CONNECT, new SocketTask("test2", () => console.log("test")));

        expect(socketClient.listOfTask.length).toBe(1);
        expect(socketClient.listOfTask[0].tasks.length).toBe(2);
        expect(socketClient.listOfTask[0].tasks[0].name).toBe("test");
        expect(socketClient.listOfTask[0].tasks[1].name).toBe("test2");
        expect(socketClient.listOfTask[0].event).toBe(SocketEvent.CONNECT);
        expect(socketClient.socket.listeners(SocketEvent.CONNECT).length).toBe(1);

    })

    test("Remove Task", () => {
        const socketClient = new SocketClient();

        socketClient.addTask("test", SocketEvent.CONNECT, new SocketTask("test", () => console.log("test")));

        socketClient.removeTask(SocketEvent.CONNECT, "test");

        expect(socketClient.listOfTask.length).toBe(0);
        expect(socketClient.socket.listeners(SocketEvent.CONNECT).length).toBe(0);
    })
})
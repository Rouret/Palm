import HTTPClient from "./client/HTTPClient";
import SocketClient from "./client/SocketClient";

export default class PalmClient {
    httpClient : HTTPClient;
    socketClient: SocketClient;

    constructor() {
        this.httpClient = new HTTPClient();
        this.socketClient = new SocketClient();
    }
}
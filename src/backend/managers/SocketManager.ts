import IManager from "./IManager";
import http from "http";
import {Socket} from "socket.io";
import GameServer from "../GameServer";


export default class SocketManager implements IManager {

    io: http.Server;

    constructor(io: http.Server) {
        this.io = io;
    }

    start(): void {
        this.io.on("connection", (socket: Socket) => {
            GameServer.instance.log(`Player connected: ${socket.id}.`);
            socket.on("init", () => {
                socket.emit("welcome", {
                    message:"Welcome to the game!"
                });
            });

            socket.on("disconnect", () => {
                GameServer.instance.log(
                    `Player disconnected: ${socket.id}.`
                );
            });
        });

        GameServer.instance.log("Socket started");
    }
    stop(): void {
        throw new Error("Method not implemented.");
    }
}
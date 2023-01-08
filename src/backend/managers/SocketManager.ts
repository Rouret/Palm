import IManager from "./IManager";
import {Socket,Server} from "socket.io";
import GameServer from "../GameServer";
import http from "http";


export default class SocketManager implements IManager {

    io: Server;

    constructor(server : http.Server) {
        this.io = new Server(server);
    }

    start(): void {
       this.io.use((socket, next) => {
          const sessionToken = socket.handshake.headers.cookie.split('=')[1];
          if (!sessionToken) {
                next(new Error("No session token"));
                return;
            }
            const session = GameServer.instance.sessions.find(s => s.uuid === sessionToken);
            if (!session || session.isExpired()) {
                next(new Error("Session expired"));
                return;
            }
            next();
        });
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
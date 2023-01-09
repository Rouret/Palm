import IManager from "./IManager";
import {Socket,Server} from "socket.io";
import GameServer from "../GameServer";
import http from "http";
import DbManager from "./DbManager";
import {Session} from "../entities/Session";


export default class SocketManager implements IManager {

    io: Server;

    constructor(server : http.Server) {
        this.io = new Server(server);
    }

    start(): void {
       this.io.use((socket, next) => {

          if (!socket.handshake.headers.cookie) {
                next(new Error("No session token"));
                return;
          }
          const sessionToken = socket.handshake.headers.cookie.split('=')[1];
           DbManager.instance.em()
               .findOne(Session, { uuid: sessionToken } )
               .then((session) => {
                   if (!session) {
                       next(new Error("No session token"))
                       return
                   }

                   if(session.expiresAt < new Date()) {
                       DbManager.instance.em().removeAndFlush(session)
                           .catch(error => {
                               GameServer.instance.log(error, "error");
                           })
                       next(new Error("Session expired"))
                   }else{
                       next()
                       return;
                   }

               })
               .catch(error => {
                   GameServer.instance.log(error, "error");
                   next(new Error(error.message))
                   return
               })
        })
        this.io.on("connection", (socket: Socket) => {
            GameServer.instance.log(`Player connected: ${socket.id}.`);

            socket.emit("welcome", {
                message:"Welcome to the game!"
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
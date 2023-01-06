import express from "express";
import path from "path";
import http from "http";
import {Server, Socket} from "socket.io";
import {Pool} from "pg";

export default class GameServer {
	app: express.Application;
    server: http.Server;
	io: Server;
    db : Pool;
	port: number;
    publicFolder: string;
    viewsFolder: string;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server);
        this.db = new Pool()
        this.port = 3000;
        this.publicFolder = "../../dist";
        this.viewsFolder = "../../views";
    }

	_setupExpress() {
        this.app.use(express.static(path.join(__dirname, this.publicFolder)));

        this.app.get("/", (req : any, res: any) => {
            res.sendFile(path.join(__dirname, this.viewsFolder, "index.html"));
        });
    }

	_setupSocket() {
        this.io.on("connection", (socket: Socket) => {
			console.log(`Player connected: ${socket.id}.`);
            socket.on("init", (data : any) => {
                socket.emit("welcome", {
                    message:"Welcome to the game!"
                });
            });

            socket.on("disconnect", () => {
                console.log(
                    `Player disconnected: ${socket.id}.`
                );
            });
        });
    }

	public start() {
		this._setupExpress();

		this._setupSocket();

		this.server.listen(this.port, () => {
            console.log(`listening on *:${this.port}`);
        });
		console.log("GameServer started");
	}
}
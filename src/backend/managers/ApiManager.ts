import IManager from "./IManager";
import express, {Request,Response} from "express";
import http from "http";
import path from "path";
import GameServer from "../GameServer";
import DbManager from "./DbManager";
import {User} from "../entities/User";

export default class ApiManager implements IManager {
    public app: express.Application;
    public server: http.Server;
    public publicFolder: string;
    public port: number;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.publicFolder = path.resolve(__dirname, "../../dist");
        this.port = 3000;
    }

    start(): void {
        this.app.get("/", (req : Request, res: Response) => {
            res.send("Hello World!");
            // create a new player
            const user = new User();
            user.username = "test";
            user.password = "test";
            user.lastLogin = new Date();
            DbManager.instance.em().persistAndFlush(user).then(() => {
                GameServer.instance.log("User created");
            });

        });

        this.server.listen(this.port, () => {
            GameServer.instance.log(`API started on port ${this.port}`);
        });
    }
    stop(): void {
        this.server.close();
    }
}

import IManager from "./IManager";
import express, {Request,Response} from "express";
import http from "http";
import path from "path";
import GameServer from "../GameServer";
import cookieParser from "cookie-parser";
import uuid from "uuid";
import Session from "../utils/Session";

export default class ApiManager implements IManager {
    public  app: express.Application;
    public server: http.Server;
    public publicFolder: string;
    public port: number;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.publicFolder = path.resolve(__dirname, "../../dist");
        this.port = 3000;
    }

    checkSession(req: Request, res: Response, next: Function) {
        const sessionToken = req.cookies.session_token;
        if (!sessionToken) {
            next();
            return;
        }

        const session = GameServer.instance.sessions.find(s => s.uuid === sessionToken);
        if (!session || session.isExpired()) {
            res.status(401).end();
            return;
        }

        next();
    }

    start(): void {
        this.app.use(express.json());
        this.app.use(cookieParser())
        this.app.use(this.checkSession);

        this.app.get("/", (req : Request, res: Response) => {

        });

        this.app.post("/auth/signin", (req : Request, res: Response) => {
            const { username, password } = req.body

            if (!username) {
                // If the username isn't present, return an HTTP unauthorized code
                res.status(401).end()
                return
            }

            const isGoodPassword = true;
            if (!isGoodPassword) {
                res.status(401).end()
                return
            }

            const session = new Session(username)
            GameServer.instance.sessions.push(session)
            res.cookie("session_token", session.uuid, { expires: session.expiresAt })
            res.end()
        });

        this.server.listen(this.port, () => {
            GameServer.instance.log(`API started on port ${this.port}`);
        });
    }
    stop(): void {
        this.server.close();
    }
}

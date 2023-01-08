import IManager from "./IManager";
import express, {Request,Response} from "express";
import http from "http";
import path from "path";
import GameServer from "../GameServer";
import cookieParser from "cookie-parser";
import Session from "../utils/Session";
import DbManager from "./DbManager";
import bcrypt from 'bcrypt';
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

    checkSession(req: Request, res: Response, next: Function) {
        if (req.path === "/auth/signin" || req.path === "/auth/signup") {
            next()
            return
        }
        const sessionToken = req.cookies.palm_session;
        if (!sessionToken) {
            next();
            return;
        }
        console.log(JSON.stringify(GameServer.instance.sessions))
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

        this.app.post("/auth/signup", this._signUp);
        this.app.post("/auth/signin", this._signIn);

        this.server.listen(this.port, () => {
            GameServer.instance.log(`API started on port ${this.port}`);
        });
    }
    stop(): void {
        this.server.close();
    }

    private _signUp(req: Request, res: Response) {
        const { username, password } = req.body

        if (!username || !password) {
            res
                .status(400)
                .json({ message: "Username and password are required" })
                .end()
            return
        }

        DbManager.instance.em().findOne(User, { username }).then(user => {
            if (user) {
                res
                    .status(409)
                    .json({ message: "Username already taken" })
                    .end()
                return
            }
            const newUser = new User(username,bcrypt.hashSync(password, 10));
            DbManager.instance.em().persistAndFlush(newUser).then(() => {
                res
                    .status(201)
                    .json({ message: "User created" })
                    .end()
            }).catch(error => {
                GameServer.instance.log(error, "error");
                res
                    .status(500)
                    .json({ error: error.message })
                    .end()
            });
        })
    }

    private _signIn(req: Request, res: Response) {
        const { username, password } = req.body
        DbManager.instance.em().findOne(User, { username }).then(user => {
            if (!user) {
                res
                    .status(401)
                    .json({ message: "Invalid username or password" })
                    .end()
                return
            }

            if (!bcrypt.compareSync(password, user.password)) {
                res
                    .status(401)
                    .json({ message: "Invalid username or password" })
                    .end()
                return
            }

            const session = new Session(user.uuid)
            GameServer.instance.sessions.push(session)
            res.cookie(Session.COOKIE_NAME, session.uuid, { expires: session.expiresAt })
            res.end()
        }).catch(error => {
            res.status(500).end()
        });
    }
}

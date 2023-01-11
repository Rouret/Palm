import IManager from "./IManager";
import express, {NextFunction, Request, Response} from "express";
import http from "http";
import path from "path";
import GameServer from "../GameServer";
import cookieParser from "cookie-parser";
import {Session} from "../entities/Session";
import DbManager from "./DbManager";
import bcrypt from 'bcrypt';
import {User} from "../entities/User";

export default class ApiManager implements IManager {
    public app: express.Application;
    public server: http.Server;
    public port: number;
    public publicFolder = path.join(__dirname, "../../../dist");
    static PUBLIC_ROUTES = [
        "/auth/signin",
        "/auth/signup",
        "/"
    ]

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.port = parseInt(process.env.PORT) || 3000;
    }

    checkSession(req: Request, res: Response, next: NextFunction) {
        if (ApiManager.PUBLIC_ROUTES.includes(req.path) || req.path.includes("/public")) {
            next()
            return
        }
        const sessionToken = req.cookies.palm_session;
        if (!sessionToken) {
            next();
            return;
        }
        DbManager.instance.em()
            .findOne(Session, { uuid: sessionToken } )
            .then((session) => {
            if (!session) {
                res
                    .status(401)
                    .json({ message: "Invalid session" })
                    .end()
                return
            }

            if(session.expiresAt < new Date()) {
                DbManager.instance.em().removeAndFlush(session)
                    .catch(error => {
                        GameServer.instance.log(error, "error");
                    })
                res
                    .status(440)
                    .json({ message: "Session expired" })
                    .end()
                return
            }
            next()
        }).catch(error => {
            GameServer.instance.log(error, "error");
            res
                .status(500)
                .json({ error: error.message })
                .end()
        })

    }

    start(): void {
        this.app.use(express.json());
        this.app.use(cookieParser())
        this.app.use(this.checkSession);

        //Public folder
        this.app.use('/public',express.static(this.publicFolder));

        this.app.get("/", (req, res) => {
            res.sendFile("index.html", { root: this.publicFolder });
        });
        this.app.get("/test", (req, res) => {
            res.send("Hello world!");
        });
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
        //Check if user and password are provided
        if (!username || !password) {
            res
                .status(400)
                .json({ message: "Username and password are required" })
                .end()
            return
        }
        DbManager.instance.em().findOne(User, { username }).then(user => {
            //User already exists
            if (user) {
                res
                    .status(409)
                    .json({ message: "Username already taken" })
                    .end()
                return
            }
            //Create user
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
            //User not found
            if (!user) {
                res
                    .status(401)
                    .json({ message: "Invalid username or password" })
                    .end()
                return
            }
            //Password check
            if (!bcrypt.compareSync(password, user.password)) {
                res
                    .status(401)
                    .json({ message: "Invalid username or password" })
                    .end()
                return
            }
            //Session
            DbManager.instance.em().findOne(Session, { user }).then(session => {
                if(session) {
                    DbManager.instance.em().removeAndFlush(session)
                        .catch(error => {
                            GameServer.instance.log(error, "error");
                            res
                                .status(500)
                                .json({error: error.message})
                                .end()
                        })
                }
                const newSession = new Session(user);
                DbManager.instance.em().persistAndFlush(newSession).then(() => {
                    res
                        .cookie(Session.COOKIE_NAME, newSession.uuid)
                        .status(200)
                        .json({ message: "User logged in" })
                        .end()
                })

            })


        }).catch(error => {
            res
                .status(500)
                .json({ error: error.message })
                .end()
        });
    }
}

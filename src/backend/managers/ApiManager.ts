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
import SessionManager from "./SessionManager";

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
        this.port = 3000;
    }

    async checkSession(req: Request, res: Response, next: NextFunction) {
        if (ApiManager.PUBLIC_ROUTES.includes(req.path) || req.path.includes("/public")) {
            next()
            return
        }
        const sessionToken = req.cookies.palm_session;
        if (!sessionToken) {
            res
                .status(401)
                .json({ message: "Unauthorized, no token." })
                .end()
            return
        }
        try{
            if(SessionManager.instance.isSessionExistAndValid(sessionToken)){
                next()
                return
            }

            const session = await DbManager.instance.em()
                .findOne(Session, { uuid: sessionToken })

            if (!session) {
                res
                    .status(401)
                    .json({ message: "Unauthorized, no session found." })
                    .end()
                return
            }

            if(session.expiresAt < new Date()) {
                await DbManager.instance.em().removeAndFlush(session)
                res
                    .status(401)
                    .json({ message: "Session expired" })
                    .end()
                return
            }
            next()
            return
        }catch (error) {
            GameServer.instance.log(error, "error");
            res
                .status(500)
                .json(error);
            return
        }
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

        this.app.get("/user", this._getCurrentUser);
        this.app.post("/auth/signup", this._signUp);
        this.app.post("/auth/signin", this._signIn);

        this.server.listen(this.port, () => {
            GameServer.instance.log(`API started on port ${this.port}`);
        });
    }
    stop(): void {
        this.server.close();
    }

    private async _getCurrentUser(req: Request, res: Response){
        const sessionToken = req.cookies.palm_session;
        try{
            const session = await DbManager.instance.em()
                .findOne(Session, { uuid: sessionToken } )
            res
                .json(session.user)
                .status(200);
            return
        }catch (error) {
            GameServer.instance.log(error, "error");
            res
                .status(500)
                .json({ error: error.message })
                .end()
            return
        }
    }

    private async _signUp(req: Request, res: Response) {
        const {username, email, password} = req.body
        //Check if user and password are provided
        if (!username || !email || !password) {
            res
                .status(400)
                .json({message: "Username, email and password are required"})
                .end()
            return
        }
        try {
            const user = await DbManager.instance.em().findOne(User, { $or: [{ username }, { email }] });
            //User already exists
            if (user) {
                res
                    .status(409)
                    .json({message: "Username already taken"})
                    .end()
                return
            }
            //Create user
            const newUser = new User(email, username, bcrypt.hashSync(password, 10));
            await DbManager.instance.em().persistAndFlush(newUser)
            res
                .status(201)
                .json({message: "User created"})
                .end()
            return
        } catch(error){
            GameServer.instance.log(error, "error");
            res
                .status(500)
                .json({error: error.message})
                .end()
            return
        }
    }

    private async _signIn(req: Request, res: Response) {
        const { email, password } = req.body

        if (!email || !password) {
            res
                .status(400)
                .json({message: "Username and password are required"})
                .end()
            return
        }
        try {
            const user = await DbManager.instance.em().findOne(User, { email });

            if (!user) {
                res
                    .status(401)
                    .json({ message: "Invalid email or password" })
                    .end()
                return
            }
            //Password check
            if (!bcrypt.compareSync(password, user.password)) {
                res
                    .status(401)
                    .json({ message: "Invalid email or password" })
                    .end()
                return
            }
            //Session

            const session = await DbManager.instance.em().findOne(Session, { user });
            if(session) {
                try{
                    SessionManager.instance.removeSession(session)
                    await DbManager.instance.em().removeAndFlush(session)
                } catch (error) {
                    GameServer.instance.log(error, "error");
                    res
                        .status(500)
                        .json({error: error.message})
                        .end()
                    return
                }
            }

            const newSession = new Session(user)
            SessionManager.instance.addSession(newSession)
            await DbManager.instance.em().persistAndFlush(newSession);

            user.updateLastLogin();

            await DbManager.instance.em().persistAndFlush(user);

            res
                .cookie(Session.COOKIE_NAME, newSession.uuid)
                .status(200)
                .json({ message: "User logged in" })
                .end()

        } catch (error) {
            res
                .status(500)
                .json({ error: error })
                .end()
        }
    }
}

import ApiManager from "./managers/ApiManager";
import SocketManager from "./managers/SocketManager";
import DbManager from "./managers/DbManager";
import {Mode} from "./utils/Mode";
import {Logger} from "log4js";
import Session from "./utils/Session";

export default class GameServer{
    public static instance: GameServer;
	api : ApiManager
	io: SocketManager;
    db : DbManager;
    mode: Mode;
    logger: Logger;
    sessions : Array<Session> = [];

    constructor(logger: Logger) {
        this.logger = logger;
        this.mode = Mode[process.env.mode || "development"] as Mode;
        this.api = new ApiManager();
        this.io = new SocketManager(this.api.server);
        this.db = new DbManager()
        GameServer.instance = this;
    }

    log(message: string, level = "info") {
        this.logger.log(level,message);
    }

	public start() {
        try {
            this.api.start();
            this.io.start();
            this.db.start();
        }
        catch (e) {
            this.api.stop();
            this.io.stop();
            this.db.stop();
        }
	}
}
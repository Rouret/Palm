import ApiManager from "./managers/ApiManager";
import SocketManager from "./managers/SocketManager";
import DbManager from "./managers/DbManager";
import {Logger} from "log4js";
import {Session} from "./entities/Session";
import SessionManager from "./managers/SessionManager";


export default class GameServer{
    public static instance: GameServer;
	api : ApiManager
	io: SocketManager;
    db : DbManager;
    logger: Logger;
    session: SessionManager;


    constructor(logger: Logger) {
        this.logger = logger;
        this.api = new ApiManager();
        this.io = new SocketManager(this.api.server);
        this.db = new DbManager()
        this.session = new SessionManager()
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
import IManager from "./IManager";
import GameServer from "../GameServer";
import {MikroORM, PostgreSqlDriver, EntityManager} from "@mikro-orm/postgresql";
import config from "../../mikro-orm.config";
export default class DbManager implements IManager {
    public static instance: DbManager;
    public orm: MikroORM ;
    public em = (): EntityManager => {
        return this.orm.em;
    }

    constructor() {
        DbManager.instance = this;
    }
    start(): void {
        this.initORM().then(orm => {
            this.orm = orm;
            GameServer.instance.log("Database connected");
        }).catch(
            error => {
                GameServer.instance.log(error, "error");
                throw error;
            }
        );
    }
    stop(): void {
        this.orm.close().then(() => {
            GameServer.instance.log("Database disconnected");
        });
    }

    async initORM(): Promise<MikroORM> {
        return await MikroORM.init<PostgreSqlDriver>(config);
    }
}

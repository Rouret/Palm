import IManager from "./IManager";
import GameServer from "../GameServer";
import {MikroORM, PostgreSqlDriver, EntityManager} from "@mikro-orm/postgresql";
import {RequestContext} from "@mikro-orm/core";
import express from "express";
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
            const app = express();

            app.use((req, res, next) => {
                RequestContext.create(orm.em, next);
            });
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
        console.log("initORM");
        console.log("config", config)
        return await MikroORM.init<PostgreSqlDriver>(config);
    }
}

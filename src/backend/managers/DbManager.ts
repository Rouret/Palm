import IManager from "./IManager";
import GameServer from "../GameServer";
import {MikroORM, PostgreSqlDriver, EntityManager } from "@mikro-orm/postgresql";
import {RequestContext} from "@mikro-orm/core";
import express from "express";
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
        MikroORM.init<PostgreSqlDriver>({
            entities: ['./dist/backend/entities'], // path to our JS entities (dist), relative to `baseDir`
            entitiesTs: ['./src/backend/entities'], // path to our TS entities (src), relative to `baseDir`
            dbName: process.env.DB_DATABASE,
            type: 'postgresql',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            allowGlobalContext: true,
        }).then(orm => {
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
}

import IManager from "./IManager";
import {Pool} from "pg";
import GameServer from "../GameServer";

export default class DbManager implements IManager {
    connexion : Pool;

    constructor() {
        //Parameters config in env
        this.connexion = new Pool();
    }
    start(): void {
        //Check connexion
        this.connexion.query("SELECT NOW() as now")
            .then(() => {
                GameServer.instance.log("Database connected");
            })
            .catch((err) => {
                this.stop();
                throw err;
            })
    }
    stop(): void {
        this.connexion.end();
    }
}
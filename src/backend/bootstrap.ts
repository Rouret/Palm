import GameServer from './GameServer';
import * as dotenv from 'dotenv'
import log4js from "log4js";
import path from "path";

//DOTENV
dotenv.config()

//log4js
//the file name is log4js.config.json in root folder
log4js.configure(path.resolve(__dirname, "../../log4js.config.json"));

const logger = log4js.getLogger();
logger.level = "debug";

//GAME SERVER
const gameServer = new GameServer(logger);
gameServer.start();
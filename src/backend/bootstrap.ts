import GameServer from './GameServer';
import * as dotenv from 'dotenv'

dotenv.config()

const gameServer = new GameServer();
gameServer.start();
import {User} from "./backend/entities/User";
import {Player} from "./backend/entities/Player";
import {Tile} from "./backend/entities/Tile";
import {PlayerStat} from "./backend/entities/PlayerStat";

export default {
    entities: [User, Player, PlayerStat, Tile], // no need for `entitiesTs` this way
    dbName: process.env.DB_DATABASE,
    type: 'postgresql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

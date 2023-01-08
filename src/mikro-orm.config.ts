import {User} from "./backend/entities/User";
import {Player} from "./backend/entities/Player";
import {Tile} from "./backend/entities/Tile";
import {PlayerStat} from "./backend/entities/PlayerStat";
import {Options} from "@mikro-orm/postgresql";

const config: Options = {
    entities: [User, Player, PlayerStat, Tile], // no need for `entitiesTs` this way
};

export default config;

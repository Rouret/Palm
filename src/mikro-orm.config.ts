import {User} from "./backend/entities/User";
import {Character} from "./backend/entities/Character";
import {Tile} from "./backend/entities/Tile";
import {CharacterStat} from "./backend/entities/CharacterStat";
import {Options} from "@mikro-orm/postgresql";
import {Session} from "./backend/entities/Session";

const config: Options = {
    entities: [User, Character, CharacterStat, Tile, Session], // no need for `entitiesTs` this way
};

export default config;

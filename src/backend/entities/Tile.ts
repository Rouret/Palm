import {Entity, Property} from "@mikro-orm/core";
import {CustomBaseEntity} from "./CustomBaseEntity";

@Entity()
export class Tile extends CustomBaseEntity {
    @Property()
    name!: string;
}

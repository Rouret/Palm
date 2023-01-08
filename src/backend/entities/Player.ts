import {Entity, ManyToOne, Property} from "@mikro-orm/core";
import {CustomBaseEntity} from "./CustomBaseEntity";
import {User} from "./User";
import {Tile} from "./Tile";

@Entity()
export class Player extends CustomBaseEntity {
        @ManyToOne()
        user!: User;
        @ManyToOne()
        tile!: Tile;
        @Property()
        name!: string;
        @Property()
        level!: number;
        @Property()
        xp!: number;
        @Property()
        x!: number;
        @Property()
        y!: number;

        move(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
        changeTile(tile: Tile) {
            this.tile = tile;
        }
        levelUp() {
            this.level++;
        }
}

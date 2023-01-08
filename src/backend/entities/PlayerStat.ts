import {Entity, ManyToOne, Property} from "@mikro-orm/core";
import {CustomBaseEntity} from "./CustomBaseEntity";
import {Player} from "./Player";
import {StatType} from "./StatType";

@Entity()
export class PlayerStat extends CustomBaseEntity {
    @ManyToOne()
    player!: Player;
    @Property()
    value!: number;
    @Property()
    type!: StatType;

    increaseValue(value: number) {
        this.value += value;
    }
}

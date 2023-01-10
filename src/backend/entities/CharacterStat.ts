import {Entity, ManyToOne, Property} from "@mikro-orm/core";
import {CustomBaseEntity} from "./CustomBaseEntity";
import {Character} from "./Character";
import {StatType} from "./StatType";

@Entity()
export class CharacterStat extends CustomBaseEntity {
    @ManyToOne()
    player!: Character;
    @Property()
    value!: number;
    @Property()
    type!: StatType;

    increaseValue(value: number) {
        this.value += value;
    }
}

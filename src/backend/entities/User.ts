import {DateTimeType, Entity, Property} from "@mikro-orm/core";
import {CustomBaseEntity} from "./CustomBaseEntity";

@Entity()
export class User extends CustomBaseEntity {

    @Property()
    username!: string;

    @Property()
    password!: string;

    @Property({ type: DateTimeType })
    lastLogin!: Date;
}

import {DateTimeType, Entity, Property} from "@mikro-orm/core";
import {CustomBaseEntity} from "./CustomBaseEntity";

@Entity()
export class User extends CustomBaseEntity {
    constructor(username: any, password: any) {
        super();
        this.username = username;
        this.password = password;
        this.lastLogin = new Date();
    }

    @Property()
    username!: string;
    @Property()
    password!: string;
    @Property({ type: DateTimeType })
    lastLogin!: Date;

    updateLastLogin() {
        this.lastLogin = new Date();
    }
    changePassword(password: string) {
        this.password = password;
    }
}

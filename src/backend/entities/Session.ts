import { v4 } from 'uuid';
import {Entity, OneToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {User} from "./User";

@Entity()
export class Session {
    static COOKIE_NAME = "palm_session";
    @PrimaryKey({ type: 'uuid' })
    uuid = v4();
    @OneToOne()
    user!: User;
    @Property()
    expiresAt!: Date;

    constructor(user: User) {
        this.user = user;
        //set expiration date to the next night day
        this.expiresAt = new Date(+new Date() + 4 * 24 * 60 * 60 * 1000);
        this.expiresAt.setHours(4)
        this.expiresAt.setMinutes(0)
    }
}
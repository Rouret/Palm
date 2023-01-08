import { v4 } from 'uuid';

export default class Session {

    static COOKIE_NAME = "palm_session";
    username: string;
    expiresAt: Date;
    uuid: string;
    expireTime : number = 365 * 24 * 60 * 60 * 1000;

    constructor(username: string) {
        this.username = username;
        this.expiresAt = new Date(+new Date() + this.expireTime);
        this.uuid = v4();
    }

    isExpired() {
        return this.expiresAt < (new Date())
    }
}
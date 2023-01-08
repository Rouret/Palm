import uuid from "uuid";

export default class Session {
    username: string;
    expiresAt: Date;
    uuid: string;
    expireTime : number = 24 * 60 * 60 * 1000;

    constructor(username: string) {
        this.username = username;
        this.expiresAt = new Date(+new Date() + this.expireTime);
        this.uuid = uuid.v4();
    }

    isExpired() {
        return this.expiresAt < (new Date())
    }
}
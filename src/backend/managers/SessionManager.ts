import {Session} from "../entities/Session";
import {UuidType} from "@mikro-orm/core";

export default class SessionManager {
    public static instance: SessionManager;
    session : Array<Session> = [];

    constructor() {
        SessionManager.instance = this;
    }

    public addSession(session: Session) {
        if (!this._getSession(session.uuid)) {
            this.session.push(session)
        }
    }

    public removeSession(session: Session) {
        this.session = this.session.filter(s => s.uuid !== session.uuid)
    }

    public isSessionExistAndValid(sessionId: UuidType) {
        const s = this._getSession(sessionId);

        if(s && s.expiresAt < new Date()) {
            this.removeSession(s)
            return false
        }
        return s && s.expiresAt >= new Date()
    }


    private _getSession(sessionId: UuidType) {
        return this.session.find(s => s.uuid === sessionId)
    }


}
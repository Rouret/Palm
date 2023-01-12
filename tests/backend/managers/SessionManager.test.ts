import SessionManager from "../../../src/backend/managers/SessionManager";
import {Session} from "../../../src/backend/entities/Session";
import {User} from "../../../src/backend/entities/User";

describe("SessionManager", () => {
    test("Add Session", () => {
        const sessionManager = new SessionManager();
        const session = new Session(new User("a","b","c"));

        sessionManager.addSession(session);

        expect(sessionManager.session).toContain(session);
        expect(sessionManager.session.length).toBe(1);
    })

    test("Add a session when it is already defined", () => {
        const sessionManager = new SessionManager();
        const session = new Session(new User("a","b","c"));

        sessionManager.addSession(session);
        sessionManager.addSession(session);

        expect(sessionManager.session).toContain(session);
        expect(sessionManager.session.length).toBe(1);
    })

    test("Remove session", () => {
        const sessionManager = new SessionManager();
        const session = new Session(new User("a","b","c"));

        sessionManager.removeSession(session);

        expect(sessionManager.session.length).toBe(0);
    })

    test("Valid a session with future expireAt date", () => {
        const sessionManager = new SessionManager();
        const session = new Session(new User("a","b","c"));

        sessionManager.addSession(session);

        expect(sessionManager.isSessionExistAndValid(session.uuid)).toBeTruthy();
        expect(sessionManager.session).toContain(session);
        expect(sessionManager.session.length).toBe(1);
    })

    test("Not valid a session with past expireAt date", () => {
        const sessionManager = new SessionManager();
        const session = new Session(new User("a","b","c"));
        session.expiresAt = new Date(0);

        sessionManager.addSession(session);

        expect(sessionManager.isSessionExistAndValid(session.uuid)).toBeFalsy();
        expect(sessionManager.session.length).toBe(0);
    })
})
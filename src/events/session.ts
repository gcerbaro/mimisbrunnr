export enum SessionEvents{
    LOGOUT = 'session.logout',
}

export type ISessionEvent<T extends SessionEvents = SessionEvents> = {
    [SessionEvents.LOGOUT]:{
        sessionId: string,
    };
}[T];
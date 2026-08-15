/**
 * TypeORM store for express-session
 */
import { Store } from "express-session";
import { Session } from "../../modules/auth/model/session.entity";
import { LessThan, Repository } from "typeorm";
import { clearInterval } from "timers";

const DEFAULT_TTL_SECS = 86400; //if cookie has no maxAge
const DEFAULT_CLEANUP_INTERVAL_SECS = 86400; //sweep expired sessions
const DEFAULT_EXPIRATION_INTERVAL = 86400;

export interface Options {
    repository: Repository<Session>;
    ttl?: number;
    clearExpired?: boolean;
    expirationInterval?: number;
    captureRejections?: boolean | undefined;

}

export class TypeOrmStore extends Store {
    private readonly repository: Repository<Session>;
    private readonly ttl?: number;
    private readonly expirationInterval: number; //in seconds, defaults to one day
    private expirationIntervalId?: NodeJS.Timeout;

    constructor(options: Options) {
        super({ captureRejections: options.captureRejections });

        if (!options.repository) {
            throw new Error("No TypeOrmStore repository assigned");
        }

        this.repository = options.repository;
        this.ttl = options.ttl;
        this.expirationInterval =
            options.expirationInterval ?? DEFAULT_EXPIRATION_INTERVAL; 

        //sets to the default constant if nothing is passed/found
        if (options.clearExpired === undefined || options.clearExpired) {
            this.setExpirationInterval();
        }
    }

    /**
     * Get all
     */
    all = (callback?: (err: any, obj?: Record<string, any> | null) => void): void => {
        this.repository
            .find()
            .then((sessions) => {
                const now = Date.now();
                const result: Record<string, any> = {};
                for (const s of sessions) {
                    if (s.expiresAt.getTime() >= now) {
                        result[s.id] = JSON.parse(s.json);
                    }
                }
                callback?.(null, result);
            })
            .catch((err) => callback?.(err));
    };

    /**
     * Destroys a session
     */
    destroy = (id: string, callback?: (err?: any) => void): void => {
        this.repository
            .softDelete(id)
            .then(() => callback?.())
            .catch((err) => callback?.(err));
    };

    /**
     * Destroys all sessions
     */
    clear = (callback?: (err?: any) => void): void => {
        this.repository
            .clear()
            .then(() => callback?.())
            .catch((err) => callback?.(err));
    };

    /**
     * Number of sessions
     */
    length = (callback: (err?: any, length?: number) => void) => {
        this.repository
            .count()
            .then((count) => callback?.(null, count))
            .catch((err) => callback(err));
    };

    get(id: string, callback: (err: any, session?: any) => void): void {
        this.repository
            .findOne({ where: { id: id, } })
            .then((entity) => {
                if (!entity) {
                    return callback(null, null);
                }
                
                if (entity.expiresAt.getTime() < Date.now()) {
                    //let the sweep deletes automatically
                    return callback(null, null);
                }
                callback(null, JSON.parse(entity.json));
            })
            .catch((err) => callback(err));

    };

    set(id: string, session: any, callback?: (err?: any) => void): void {
        const json = JSON.stringify(session);
        const ttl = this.getTTL(session);
        const expiresAt = new Date(Date.now() + ttl * 1000);

        this.repository
            .save({ id, json, expiresAt })
            .then(() => callback?.())
            .catch((err) => callback?.(err));
    };

    /**
     * Refreshes session expire time 
     */
    touch = (id: string, session: any, callback?: (err?: any) => void): void => {
        const ttl = this.getTTL(session);
        const expiresAt = new Date(Date.now() + ttl * 1000);

        this.repository
            .update(id, { expiresAt })
            .then(() => callback?.())
            .catch((err) => callback?.(err));

    };

    clearExpired = (): void => {
        this.repository.delete({ expiresAt: LessThan(new Date()) }).catch((err) => {
            console.error("TypeOrm failed to clear expired sessions", err)
        });
    };

    setExpirationInterval = (interval?: number): void => {
        const expirationInterval = interval ?? this.expirationInterval;

        this.clearExpirationInterval();
        this.expirationIntervalId = setInterval(
            this.clearExpired,
            expirationInterval * 1000
        );

        // Do not allow the sweep timer to keep the process alive on its own
        this.expirationIntervalId.unref?.();
    };

    clearExpirationInterval = (): void => {
        if (this.expirationIntervalId) {
            clearInterval(this.expirationIntervalId);
        }

        this.expirationIntervalId = undefined;
    }

    private getTTL = (session: any): number => {
        if (this.ttl) {
            return this.ttl;
        }
        return session.cookie && session.cookie.maxAge
            ? Math.floor(session.cookie.maxAge / 1000) : DEFAULT_TTL_SECS;
    };

}
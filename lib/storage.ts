import {Database, RunResult} from './database';

interface IdRow {
    rowid: number;
}

export interface ServerCheck {
    id: number;
    page: string;
    server: number;
    httpStatus: number;
    responseTime: number;
    checkedAt: Date;
}

interface DbServerCheck {
    id: number;
    page: string;
    server: number;
    httpStatus: number;
    responseTime: number;
    checkedAt: number;
}

export class Storage {
    public active: boolean;
    public dbName: string;
    public db: Database;
    public dbClass: typeof Database;

    public constructor(dbName: string) {
        this.dbName = dbName;
        this.db = null;
        this.active = false;
        this.dbClass = Database;
    }

    public activate(): Promise<{}> {
        if (this.active) {
            return Promise.resolve(undefined);
        }
        this.db = new this.dbClass(this.dbName);
        return this.db.activate()
            .then(() => this.db.run('CREATE TABLE IF NOT EXISTS pages (' +
                '    key VARCHAR(255) NOT NULL' +
                ');', {}))
            .then(() => this.db.run('CREATE TABLE IF NOT EXISTS checks (' +
                '    page INT NOT NULL,' +
                '    server INT NOT NULL,' +
                '    httpStatus INT NOT NULL,' +
                '    responseTime INT NOT NULL,' +
                '    checkedAt DATETIME NOT NULL,' +
                '    FOREIGN KEY (page) REFERENCES pages(OID)' +
                ')', {}))
            .then(() => {
                this.active = true;
        });
    }

    public getPageId(page: string): Promise<number> {
        return this.activate()
            .then(() => this.db.all('SELECT OID FROM pages WHERE key = ? LIMIT 1', [page]))
            .then((ids: IdRow[]) => {
                if (ids && ids.length > 0) {
                    return ids[0].rowid;
                }
                return this.db.run('INSERT INTO pages (key) VALUES (?)', [page])
                    .then((result: RunResult) => result.lastID);
            });
    }

    public addCheck(page: string, server: number, httpStatus: number, responseTime: number): Promise<{}> {
        const now = new Date().getTime();
        return this.getPageId(page)
            .then((pageId: number) => this.db.run('INSERT INTO checks ' +
                '(page, server, httpStatus, responseTime, checkedAt) ' +
                'VALUES(?, ?, ?, ?, ?)', [pageId, server, httpStatus, responseTime, now]));
    }

    public getChecks(after?: Date, limit?: number): Promise<ServerCheck[]> {
        let afterTimestamp = (after) ? after.getTime() : Date.now() - 10 * 60 * 1000;
        if (!limit || limit < 0 || limit > 30000) {
            limit = 30000; //TODO: This should be configurable
        }
        return this.activate()
            .then(() => this.db.all('SELECT c.OID as id, p.key AS page, c.server, ' +
                'c.httpStatus, c.responseTime, c.checkedAt ' +
                'FROM checks c JOIN pages p ON c.page = p.OID ' +
                'WHERE checkedAt > ? ORDER BY c.checkedAt LIMIT ?', [afterTimestamp, limit])
                .then((results: DbServerCheck[]) => results.map((result: DbServerCheck) => {
                    return {
                        id: result.id,
                        page: result.page,
                        server: result.server,
                        httpStatus: result.httpStatus,
                        responseTime: result.responseTime,
                        checkedAt: new Date(result.checkedAt)
                    };
                })));
    }
}

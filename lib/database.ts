'use strict';

/// <reference path="../typings/index.d.ts" />

import {Database as SqliteDB} from 'sqlite3';

export interface RunResult {
    lastID: number;
}

export class Database {
    public active: boolean;
    private dbName: string;
    private db: SqliteDB;

    public constructor(dbName: string) {
        this.dbName = dbName;
        this.db = null;
        this.active = false;
    }
    public activate(): Promise<{}> {
        if (this.active) {
            return Promise.resolve(undefined);
        }
        return new Promise((resolve, reject) => {
            this.db = new SqliteDB(this.dbName, (err: Error): void => {
                if (err) {
                    return reject(err);
                }
                this.active = true;
                return resolve(undefined);
            });
        });
    }

    // tslint:disable-next-line:no-any
    public run(query: string, params: any): Promise<RunResult> {
        return this.runQuery('run', query, params);
    }

    // tslint:disable-next-line:no-any
    public exec(query: string): Promise<any> {
        return this.runQuery('exec', query, undefined);
    }

    // tslint:disable-next-line:no-any
    public all(query: string, params: any): Promise<any> {
        return this.runQuery('all', query, params);
    }

    // tslint:disable-next-line:no-any
    public get(query: string, params: any): Promise<any> {
        return this.runQuery('get', query, params);
    }

    // tslint:disable-next-line:no-any
    private runQuery<T>(func: string, query: string, params: any): Promise<T> {
        return this.activate().then(() => {
            return new Promise((resolve, reject) => {
                // tslint:disable-next-line:only-arrow-functions no-any
                function after(err: Error, res: any): void {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res || func !== 'run' ? res : this); //eslint-disable-line no-invalid-this
                }
                if (func === 'exec') {
                    this.db.exec(query, (err: Error) => after(err, undefined));
                } else {
                    this.db[func](query, params, after);
                }
            });
        });
    }
}

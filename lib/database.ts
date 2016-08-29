'use strict';
/// <reference path="typings/modules/promise/index.d.ts">

import * as sqlite from 'sqlite3';

interface NullParameter {}
interface Resolver<T> {
    (value: T): void;
}
interface Rejector {
    (reason: Error): void;
}


export class Database {
    public activated: boolean;
    private dbName: string;
    private db: sqlite.Database;

    public constructor(dbName: string) {
        this.activated = false;
        this.dbName = dbName;
        this.db = null;
    }
    public activate(): Promise<{}> {
        if (this.activated) {
            return Promise.resolve(undefined);
        }
        return new Promise((resolve, reject) => {
            this.db = new sqlite.Database(this.dbName, (err: Error): void => {
                this.activated = true;
                if (err) {
                    return reject(err);
                }
                return resolve(undefined);
            });
        });
    }

    public run(query: string, params: {}): Promise<{}> {
        return this.runQuery('run', query, params);
    }

    public exec(query: string): Promise<{}> {
        return this.runQuery('exec', query, undefined);
    }

    public all(query: string, params: {}): Promise<{}> {
        return this.runQuery('all', query, params);
    }

    public get(query: string, params: {}): Promise<{}> {
        return this.runQuery('get', query, params);
    }

    private runQuery(func: string, query: string, params: {}): Promise<{}> {
        return this.activate().then(() => {
            return new Promise((resolve, reject) => {
                return reject(4);
                /*
                // NB. We want to capture the 'this' value of the callback as sqlite will pass information back to the
                //     callback via this method
                // tslint:disable-next-line:only-arrow-functions
                function after(err, res) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res || func !== 'run' ? res : this);
                }
                switch(func){
                    case 'run':
                        this.db.run(query, params, after);
                        break;
                    case 'all':
                        this.db.all(query, params, after);
                        break
                    case 'get':
                        this.db.get(query, params, after);
                        break;
                    case 'exec':
                    default:
                        this.db.exec(query, (err: Error) => after(err, undefined));
                        break;
                }*/
            });
        });
    }
}

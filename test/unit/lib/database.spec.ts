'use strict';

import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';

chai.use(chaiAsPromised);
chai.should();

import * as sinon from 'sinon';
//tslint:disable-next-line:no-require-imports
require('sinon-as-promised');

import * as sqlite from 'sqlite3';

import {Database} from '../../../lib/database';

describe('DB', () => {
    it('should export a function', () => {
        chai.assert.typeOf(Database, 'function');
    });
    it('should be a constructor', () => {
        let obj = new Database('foo');
        obj.should.be.instanceOf(Database);
    });
    describe('constructor', () => {
        it('should set active status', () => {
            let obj = new Database('foo');
            obj.active.should.equal(false);
        });
    });
    describe('activate', () => {
        let sandbox: Sinon.SinonSandbox = null,
            db: Database = null,
            dbConstructor: Sinon.SinonStub = null;
        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            dbConstructor = sandbox.stub(sqlite, 'Database').yields();
            db = new Database(':memory:');
        });
        afterEach(() => sandbox.restore());
        it('should create instance of sqlite.Database', () => {
            return db.activate().then(() => {
                dbConstructor.calledWithNew().should.equal(true);
            });
        });
        it('should store instance of sqlite.Database in object', () => {
            const expected = {
                alpha: `oogy boogy boo ${Math.random()}`
            };
            dbConstructor.returns(expected);
            return db.activate().then(() => {
                db.db.should.equal(expected);
            });
        });
        it('should resolve on success', () => {
            return db.activate().should.eventually.be.fulfilled;
        });
        it('should reject on failure', () => {
            const error = new Error('hi there!');
            dbConstructor.yields(error);
            return db.activate().should.eventually.be.rejectedWith(error);
        });
        it('should noop activate() on success', () => {
            return db.activate().then(() => {
                dbConstructor.reset(); // this wac called on initial, reset it
                return db.activate();
            }).then(() => {
                dbConstructor.callCount.should.equal(0);
            });
        });
        it('should not noop activate() on failure', () => {
            const original = db.activate,
                error = new Error('foo!');
            dbConstructor.yields(error);
            return db.activate().should.eventually.be.rejectedWith(error);
        });
    });
    describe('runQuery<T>()', () => {
        let sandbox: Sinon.SinonSandbox = null,
            db: Database = null,
            dbAll: Sinon.SinonStub,
            dbExec: Sinon.SinonStub,
            dbGet: Sinon.SinonStub,
            dbRun: Sinon.SinonStub,
            dbActivate: Sinon.SinonStub,
            stubs: Map<string, Sinon.SinonStub> = new Map<string, Sinon.SinonStub>([
                ['run', null],
                ['get', null],
                ['exec', null],
                ['all', null],
                ['activate', null],
            ]);
        beforeEach(() => {
            db = new Database(':memory:');
            sandbox = sinon.sandbox.create();
            return db.activate().then(() => {
                stubs.set('run', sandbox.stub(db.db, 'run').yields());
                stubs.set('all', sandbox.stub(db.db, 'all').yields());
                stubs.set('get', sandbox.stub(db.db, 'get').yields());
                stubs.set('exec', sandbox.stub(db.db, 'exec').yields());
                stubs.set('activate', sandbox.stub(db, 'activate').resolves(undefined));
            });
        });
        afterEach(() => {
            sandbox.restore();
        });
        for (let name of stubs.keys()) {
            if (name === 'activate') {
                return;
            }
            it(`should activate the db instance when executing ${name}`, () => {
                return db.runQuery(name, 'foo', [4]).then(() => {
                    stubs.get('activate').callCount.should.equal(1);
                });
            });
            it(`should proxy query to db.${name}`, () => {
                const query = `query${Math.random()}query`,
                    params = [`params${Math.random()}params`];
                return db.runQuery(name, query, params).then(() => {
                    if (name !== 'exec') {
                        stubs.get(name).calledWith(query, params).should.be.equal(true);
                    } else {
                        stubs.get(name).calledWith(query).should.be.equal(true);
                    }
                });
            });
            if (name !== 'exec') {
                it('should resolve to results of query', () => {
                    const result = [Math.random()];
                    stubs.get(name).yields(null, result);
                    return db.runQuery(name, '', '').should.eventually.equal(result);
                });
            }
            it('should reject with error', () => {
                const result = new Error(`foo ${Math.random()}`);
                stubs.get(name).yields(result);
                return db.runQuery(name, '', '').should.eventually.be.rejectedWith(result);
            });
        }
    });
    ['get', 'run', 'all'].forEach((name: string) => {
        describe(`${name}()`, () => {
            let sandbox: Sinon.SinonSandbox = null,
                runQuery: Sinon.SinonStub = null,
                db: Database = null;
            beforeEach(() => {
                sandbox = sinon.sandbox.create();
                db = new Database(':memory:');
                runQuery = sandbox.stub(db, 'runQuery').resolves(undefined);
            });
            afterEach(() => {
                sandbox.restore();
            });
            it('should proxy request to runQuery', () => {
                return db[name]('', '').then(() => {
                    runQuery.callCount.should.equal(1);
                });
            });
            it('should pass expected parameters to runQuery', () => {
                const query = `query${Math.random()}query`,
                    params = [`params${Math.random()}params`];
                return db[name](query, params).then(() => {
                    runQuery.calledWith(name, query, params).should.equal(true);
                });
            });
            it('should resolve to results of query', () => {
                const result = `result${Math.random()}result`;
                runQuery.resolves(result);
                return db[name]('', '').should.eventually.equal(result);
            });
            it('should reject when query rejects', () => {
                const result = new Error(`result${Math.random()}result`);
                runQuery.rejects(result);
                return db[name]('', '').should.eventually.be.rejectedWith(result);
            });
        });
    });
    describe(`exec()`, () => {
        let sandbox: Sinon.SinonSandbox = null,
            runQuery: Sinon.SinonStub = null,
            db: Database = null;
        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            db = new Database(':memory:');
            runQuery = sandbox.stub(db, 'runQuery').resolves(undefined);
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should proxy request to runQuery', () => {
            return db.exec('').then(() => {
                runQuery.callCount.should.equal(1);
            });
        });
        it('should pass expected parameters to runQuery', () => {
            const query = `query${Math.random()}query`;
            return db.exec(query).then(() => {
                runQuery.calledWith('exec', query).should.equal(true);
            });
        });
        it('should resolve to results of query', () => {
            const result = `result${Math.random()}result`;
            runQuery.resolves(result);
            return db.exec('').should.eventually.equal(result);
        });
        it('should reject when query rejects', () => {
            const result = new Error(`result${Math.random()}result`);
            runQuery.rejects(result);
            return db.exec('').should.eventually.be.rejectedWith(result);
        });
    });
});

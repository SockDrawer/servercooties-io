import * as chaiAsPromised from 'chai-as-promised';
import * as chaiString from 'chai-string';
import * as chai from 'chai';

chai.use(chaiAsPromised);
chai.use(chaiString);
chai.should();

import * as sinon from 'sinon';

import 'sinon-as-promised';

import {Database} from '../../../lib/database';
import {Storage, ServerCheck} from '../../../lib/storage';

describe('Storage', () => {
    it('should export a function', () => {
        chai.assert.typeOf(Storage, 'function');
    });
    it('should be a constructor', () => {
        let obj = new Storage('foo');
        obj.should.be.instanceOf(Storage);
    });
    describe('constructor', () => {
        it('should set active status', () => {
            let obj = new Storage('foo');
            obj.active.should.equal(false);
        });
        it('should set dbName', () => {
            const name = `NAME NAME ${Math.random()}`;
            let obj = new Storage(name);
            obj.dbName.should.equal(name);
        });
        it('should set db status', () => {
            let obj = new Storage('foo');
            chai.expect(obj.db).to.equal(null);
        });
        it('should set Database Class Type (for testing)', () => {
            let obj = new Storage('foo');
            obj.dbClass.should.equal(Database);
        });
    });
    describe('activate()', () => {
        let sandbox: Sinon.SinonSandbox = null,
            db: Database = null,
            store: Storage = null,
            dbClass: Sinon.SinonStub = null,
            dbActivate: Sinon.SinonStub = null,
            dbRun: Sinon.SinonStub = null;
        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            db = new Database(':memory:');
            dbActivate = sandbox.stub(db, 'activate').resolves(undefined);
            dbRun = sandbox.stub(db, 'run').resolves(undefined);
            store = new Storage(':memory:');
            dbClass = sandbox.stub(store, 'dbClass').returns(db);
        });
        afterEach(() => sandbox.restore());
        it('should create Database instance', () => {
            return store.activate().then(() => {
                dbClass.callCount.should.equal(1);
                dbClass.calledWithNew().should.equal(true);
            });
        });
        it('should create named Database instance', () => {
            const name = `databasename ${Math.random()}`;
            store.dbName = name;
            return store.activate().then(() => {
                dbClass.calledWith(name).should.equal(true);
            });
        });
        it('should activate Database instance', () => {
            return store.activate().then(() => {
                dbActivate.callCount.should.equal(1);
            });
        });
        it('should run two `CREATE TABLE` queries', () => {
            return store.activate().then(() => {
                dbRun.callCount.should.equal(2);
                dbRun.firstCall.args[0].should.startWith('CREATE TABLE IF NOT EXISTS pages (');
                dbRun.secondCall.args[0].should.startWith('CREATE TABLE IF NOT EXISTS checks (');
            });
        });
        it('should set active flag on success', () => {
            return store.activate().then(() => {
                store.active.should.equal(true);
            });
        });
        it('should not reactivate after activated', () => {
            store.active = true;
            return store.activate().then(() => {
                dbClass.callCount.should.equal(0);
                dbActivate.callCount.should.equal(0);
                dbRun.callCount.should.equal(0);
            });
        });
    });
    describe('getPageId()', () => {
        let sandbox: Sinon.SinonSandbox = null,
        store: Storage = null,
        storeActivate: Sinon.SinonStub = null,
        dbAll: Sinon.SinonStub = null,
        dbRun: Sinon.SinonStub = null;
        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            const db = new Database(':memory:');
            store = new Storage(':memory:');
            store.db = db;
            storeActivate = sandbox.stub(store, 'activate').resolves(undefined);
            dbAll = sandbox.stub(db, 'all').resolves(undefined);
            dbRun = sandbox.stub(db, 'run').resolves({});
        });
        afterEach(() => sandbox.restore());
        it('should activate Storage', () => {
            return store.getPageId('foo').then(() => {
                storeActivate.callCount.should.equal(1);
            });
        });
        it('should select Id from `pages` table', () => {
            return store.getPageId('foo').then(() => {
                dbAll.callCount.should.equal(1);
                dbAll.firstCall.args[0].should.startWith('SELECT OID FROM pages ');
            });
        });
        it('should pass page string into query', () => {
            const page = `page ${Math.random()}`;
            return store.getPageId(page).then(() => {
                dbAll.callCount.should.equal(1);
                dbAll.firstCall.args[1].should.deep.equal([page]);
            });
        });
        it('should resolve to result of query', () => {
            const expected = Math.random();
            dbAll.resolves([{rowid: expected}]);
            return store.getPageId('foo').should.become(expected);
        });
        it('should resolve to result of query', () => {
            const expected = 11 + Math.random();
            const results = [{rowid: expected}];
            for (let i = 0; i < 10; i += 1) {
                results.push({rowid: Math.random()});
            }
            dbAll.resolves(results);
            return store.getPageId('foo').should.become(expected);
        });
        it('should not insert when page is found.', () => {
            const expected = Math.random();
            dbAll.resolves([{rowid: expected}]);
            return store.getPageId('foo').then(() => {
                dbRun.callCount.should.equal(0);
            });
        });
        it('should insert page when not found', () => {
            dbAll.resolves([]);
            const page = `page${Math.random()}`;
            return store.getPageId(page).then(() => {
                dbRun.callCount.should.equal(1);
                dbRun.firstCall.args[0].should.startWith('INSERT INTO pages (key)');
                dbRun.firstCall.args[1].should.deep.equal([page]);
            });
        });
        it('should resolve to last inserted id on insert', () => {
            const expected = Math.random();
            dbRun.resolves({lastID: expected});
            return store.getPageId('foo').should.become(expected);
        });
    });
    describe('addCheck()', () => {
        let sandbox: Sinon.SinonSandbox = null,
            store: Storage = null,
            stubGetPage: Sinon.SinonStub = null,
            stubDbRun: Sinon.SinonStub = null;
        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            const db = new Database(':memory:');
            store = new Storage(':memory:');
            store.db = db;
            stubGetPage = sandbox.stub(store, 'getPageId').resolves(undefined);
            stubDbRun = sandbox.stub(db, 'run').resolves(undefined);
        });
        afterEach(() => sandbox.restore());
        it('should getPageId for selected page', () => {
            const page = `page ${Math.random()}`;
            return store.addCheck(page, 0, 0, 0).then(() => {
                stubGetPage.callCount.should.equal(1);
                stubGetPage.calledWith(page).should.equal(true);
            });
        });
        it('should insert into `checks` table', () => {
            return store.addCheck('foo', 0, 0, 0).then(() => {
                stubDbRun.callCount.should.equal(1);
                stubDbRun.firstCall.args[0].should.startWith('INSERT INTO checks ');
            });
        });
        it('should insert expected data', () => {
            const id = Math.random(),
                server = Math.random(),
                status = Math.random(),
                response = Math.random(),
                now = Math.floor(Math.random() * 1e9);
            sandbox.useFakeTimers(now);
            stubGetPage.resolves(id);
            return store.addCheck('foo', server, status, response).then(() => {
                stubDbRun.callCount.should.equal(1);
                stubDbRun.firstCall.args[1].should.deep.equal([id, server, status, response, now]);
            });
        });
    });
    describe('getChecks()', () => {
        let sandbox: Sinon.SinonSandbox = null,
            storage: Storage = null,
            stubActivate: Sinon.SinonStub = null,
            stubDbAll: Sinon.SinonStub = null,
            now = 0;
        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            storage = new Storage(':memory:');
            stubActivate = sandbox.stub(storage, 'activate').resolves(undefined);
            const db = new Database(':memory:');
            stubDbAll = sandbox.stub(db, 'all').resolves([]);
            storage.db = db;
            now =  (60 * 60 * 1000) + Math.random() * 1e10;
            sandbox.useFakeTimers(now);
        });
        afterEach(() => sandbox.restore());
        it('should activate Storage', () => {
            return storage.getChecks().then(() => {
                stubActivate.callCount.should.equal(1);
            });
        });
        it('should select data via db.all', () => {
            return storage.getChecks().then(() => {
                stubDbAll.callCount.should.equal(1);
                const query = stubDbAll.firstCall.args[0];
                query.should.startWith('SELECT ');
                query.should.contain('FROM checks c JOIN pages p');
            });
        });
        it('should select default `after` parameter', () => {
            return storage.getChecks().then(() => {
                const args = stubDbAll.firstCall.args[1];
                // default is 10 minutes ago
                args[0].should.equal(now - 10 * 60 * 1000);
            });
        });
        it('should use provided `after` parameter', () => {
            const date = new Date('2000-01-01T12:10:00');
            return storage.getChecks(date).then(() => {
                const args = stubDbAll.firstCall.args[1];
                args[0].should.equal(date.getTime());
            });
        });
        it('should use default `limit` parameter', () => {
            return storage.getChecks().then(() => {
                const args = stubDbAll.firstCall.args[1];
                args[1].should.equal(30000);
            });
        });
        it('should use provided `limit` parameter', () => {
            const limit = 100 + Math.random() * 100;
            return storage.getChecks(undefined, limit).then(() => {
                const args = stubDbAll.firstCall.args[1];
                args[1].should.equal(limit);
            });
        });
        it('should use default `limit` parameter when provided value is negative', () => {
            return storage.getChecks(undefined, -1).then(() => {
                const args = stubDbAll.firstCall.args[1];
                args[1].should.equal(30000);
            });
        });
        it('should use default `limit` parameter when provided value is zero', () => {
            return storage.getChecks(undefined, 0).then(() => {
                const args = stubDbAll.firstCall.args[1];
                args[1].should.equal(30000);
            });
        });
        it('should use default `limit` parameter when provided value is out of bounds', () => {
            return storage.getChecks(undefined, 30001).then(() => {
                const args = stubDbAll.firstCall.args[1];
                args[1].should.equal(30000);
            });
        });
        it('should resolve to empty array when no results match', () => {
            stubDbAll.resolves([]);
            return storage.getChecks().should.become([]);
        });
        it('should resolve to all results when there are results', () => {
            stubDbAll.resolves([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);
            return storage.getChecks().then((results: ServerCheck[]) => {
                results.should.have.length(10);
            });
        });
        ['id', 'page', 'server', 'httpStatus', 'responseTime'].forEach((field: string) => {
            it(`should process field '${field}'`, () => {
                const value = Math.random(),
                    obj = {};
                obj[field] = value;
                stubDbAll.resolves([obj]);
                return storage.getChecks().then((results: ServerCheck[]) => {
                    results[0][field].should.equal(value);
                });
            });
        });
        it('should deserialize `checkedAt` Date', () => {
            const time = Math.ceil(Math.random() * 1e9 + 1e9);
            stubDbAll.resolves([{checkedAt: time}]);
            return storage.getChecks().then((results: ServerCheck[]) => {
                results[0].checkedAt.should.be.instanceOf(Date);
                results[0].checkedAt.getTime().should.equal(time);
            });
        });
    });
});

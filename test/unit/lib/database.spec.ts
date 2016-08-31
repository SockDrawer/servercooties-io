'use strict';

//import {ChaiPromised} from 'chai-as-promised';

import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';

chai.use(chaiAsPromised);
chai.should();

import * as sinon from 'sinon';

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
    describe('get()', () => {
        let sandbox: Sinon.SinonSandbox = null;
        beforeEach(() => {
            sandbox = sinon.sandbox.create();
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should allow mocking', () => {
            let obj = new Database('foo');
            const spy = sandbox.stub(obj, 'runQuery');
            obj.get('', '');
            spy.callCount.should.equal(1);
        });
    });
});

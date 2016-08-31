'use strict';
var chaiAsPromised = require('chai-as-promised');
var chai = require('chai');
chai.use(chaiAsPromised);
chai.should();
var sinon = require('sinon');
var sqlite = require('sqlite3');
var database_1 = require('../../../lib/database');
describe('DB', function () {
    it('should export a function', function () {
        database_1.Database.should.be.a('function');
    });
    it('should be a constructor', function () {
        var obj = new database_1.Database('foo');
        obj.should.be.an.instanceOf(database_1.Database);
    });
    describe('constructor', function () {
        it('should set active status', function () {
            var obj = new database_1.Database('foo');
            obj.active.should.equal(false);
        });
    });
    describe('activate', function () {
        var sandbox = null, db = null, dbConstructor = null;
        beforeEach(function () {
            sandbox = sinon.sandbox.create();
            dbConstructor = sandbox.stub(sqlite, 'Database').yields();
            db = new database_1.Database(':memory:');
        });
        afterEach(function () { return sandbox.restore(); });
        it('should create instance of sqlite.Database', function () {
            return db.activate().then(function () {
                dbConstructor.calledWithNew().should.equal(true);
            });
        });
        it('should store instance of sqlite.Database in object', function () {
            var expected = {
                alpha: "oogy boogy boo " + Math.random()
            };
            dbConstructor.returns(expected);
            return db.activate().then(function () {
                db.db.should.equal(expected);
            });
        });
        it('should resolve on success', function () {
            return db.activate().should.be.resolved;
        });
        it('should reject on failure', function () {
            var error = new Error('hi there!');
            dbConstructor.yields(error);
            return db.activate().should.be.rejectedWith(error);
        });
        it('should noop activate() on success', function () {
            return db.activate().then(function () {
                dbConstructor.reset(); // this wac called on initial, reset it
                return db.activate();
            }).then(function () {
                dbConstructor.callCount.should.equal(0);
            });
        });
        it('should not noop activate() on failure', function () {
            var original = db.activate, error = new Error('foo!');
            dbConstructor.yields(error);
            return db.activate().then(function () {
                chai.assert(false, 'Function should not have resolved');
            }, function (err) {
                db.activate.should.equal(original);
                err.should.equal(error);
            });
        });
    });
    describe('get()', function () {
        var sandbox = null;
        beforeEach(function () {
            sandbox = sinon.sandbox.create();
        });
        afterEach(function () {
            sandbox.restore();
        });
        it('should allow mocking', function () {
            var obj = new database_1.Database('foo');
            var spy = sandbox.stub(obj, 'runQuery');
            obj.get('', '');
            spy.callCount.should.equal(1);
        });
    });
});

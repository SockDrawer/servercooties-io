'use strict';

import * as chai from 'chai';
chai.should();

import * as sqlite from 'sqlite3';

import {Database} from '../../../lib/database';

describe('DB', () => {
    it('should export a function', () => {
        Database.should.be.a('function');
    });
    it('should be a constructor', () => {
        let obj = new Database('foo');
        obj.should.be.an.instanceOf(Database);
    });
    describe('constructor', () => {
        it('should set active status', () => {
            let obj = new Database('foo');
            obj.active.should.equal(false);
        });
        it('should set dbName field', () => {
            const name = `name ${Math.random()}`;
            let obj = new Database(name);
            // Have to cast to any here to access private fields
            // tslint:disable-next-line:no-any
            (<any>obj).dbName.should.equal(name);
        });
    });
});

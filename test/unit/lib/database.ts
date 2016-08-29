'use strict';

import * as chai from 'chai';

chai.should();

import {Database} from '../../../lib/database';

describe('DB', () => {
    it('should export a function', () => {
        Database.should.be.a('function');
    });
    it('should be a constructor', () => {
        var obj = new Database('foo');
        obj.should.be.an.instanceOf(Database);
    });
});

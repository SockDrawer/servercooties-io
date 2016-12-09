import * as chaiAsPromised from 'chai-as-promised';
import * as chaiString from 'chai-string';
import * as chai from 'chai';

chai.use(chaiAsPromised);
chai.use(chaiString);
chai.should();

//import * as sinon from 'sinon';

//import 'sinon-as-promised';

import {Deserialize} from '../../../../lib/helpers/deserialize';

describe('Deserialize', () => {
    describe('boolean', () => {
        it('should return boolean value', () => {
            const expected = Math.random() > 0.5,
                data = {name: expected};
            Deserialize.boolean(data, 'name').should.equal(expected);
        });
        it('should return default value', () => {
            const expected = Math.random() > 0.5,
                data = {};
            Deserialize.boolean(data, 'name', expected).should.equal(expected);
        });
        it('should throw when value missing and no default', () => {
            const name = `name ${Math.random()}`,
                data = {},
                expected = `Field ${name} is required`;
            chai.expect(() => Deserialize.boolean(data, name)).to.throw(expected);
        });
        it('should throw when value is not a boolean', () => {
            const name = `name ${Math.random()}`,
                data = {},
                expected = `Field ${name} must be a boolean`;
            data[name] = 42;
            chai.expect(() => Deserialize.boolean(data, name)).to.throw(expected);
        });
    });
    describe('string', () => {
        it('should return string value', () => {
            const expected = `data ${Math.random()}`,
                data = {name: expected};
            Deserialize.string(data, 'name').should.equal(expected);
        });
        it('should return default value', () => {
            const expected = `data ${Math.random()}`,
                data = {name: ''};
            Deserialize.string(data, 'name', expected).should.equal(expected);
        });
        it('should not accept the empty string as a value', () => {
            const data = {name: ''};
            chai.expect(() => Deserialize.string(data, name)).to.throw();
        });
        it('should throw when value missing and no default', () => {
            const name = `name ${Math.random()}`,
                data = {},
                expected = `Field ${name} is required`;
            chai.expect(() => Deserialize.string(data, name)).to.throw(expected);
        });
        it('should throw when value is not a string', () => {
            const name = `name ${Math.random()}`,
                data = {},
                expected = `Field ${name} must be a string`;
            data[name] = 42;
            chai.expect(() => Deserialize.string(data, name)).to.throw(expected);
        });
    });
    describe('number', () => {
        it('should return number value', () => {
            const expected = Math.random(),
                data = {name: expected};
            Deserialize.number(data, 'name').should.equal(expected);
        });
        it('should accept 0 as a value', () => {
            const data = {name: 0};
            Deserialize.number(data, 'name').should.equal(0);
        });
        it('should return default value', () => {
            const expected = Math.random(),
                data = {};
            Deserialize.number(data, 'name', undefined, undefined, expected).should.equal(expected);
        });
        it('should throw when value missing and no default', () => {
            const name = `name ${Math.random()}`,
                data = {},
                expected = `Field ${name} is required`;
            chai.expect(() => Deserialize.number(data, name)).to.throw(expected);
        });
        it('should throw when value is not a number', () => {
            const name = `name ${Math.random()}`,
                data = {},
                expected = `Field ${name} must be a number`;
            data[name] = true;
            chai.expect(() => Deserialize.number(data, name)).to.throw(expected);
        });
        it('should throw when value is below default minimum', () => {
            const data = {name: -1},
                expected = `Field name must be between 0 and 100`;
            chai.expect(() => Deserialize.number(data, 'name')).to.throw(expected);
        });
        it('should throw when value is above default maximum', () => {
            const data = {name: 101},
                expected = `Field name must be between 0 and 100`;
            chai.expect(() => Deserialize.number(data, 'name')).to.throw(expected);
        });

        it('should throw when value is below custom minimum', () => {
            const data = {name: -101},
                expected = `Field name must be between -100 and 100`;
            chai.expect(() => Deserialize.number(data, 'name', -100)).to.throw(expected);
        });
        it('should throw when value is above custom maximum', () => {
            const data = {name: 1001},
                expected = `Field name must be between 0 and 1000`;
            chai.expect(() => Deserialize.number(data, 'name', undefined, 1000)).to.throw(expected);
        });
    });
    describe('list', () => {
        it('should return list value', () => {
            const expected = ['a', 'b', 'c'],
                data = {name: expected};
            Deserialize.list(data, 'name').should.equal(expected);
        });
        it('should return default value', () => {
            const expected = ['a', 'b', 'c'],
                data = {name: null};
            Deserialize.list(data, 'name', expected).should.equal(expected);
        });
        it('should throw for missing value with no default', () => {
            const expected = 'Field name is required',
                data = {};
            chai.expect(() => Deserialize.list(data, 'name')).to.throw(expected);
        });
        it('should throw for non array value', () => {
            const expected = 'Field name must be an array of string',
                data = {name: 12};
            chai.expect(() => Deserialize.list(data, 'name')).to.throw(expected);
        });
        it('should throw for non string array value', () => {
            const expected = 'Field name must be an array of string',
                data = {name: [12]};
            chai.expect(() => Deserialize.list(data, 'name')).to.throw(expected);
        });
    });
    describe('map', () => {
        it('should return a Map', () => {
            const data = {name: {}};
            Deserialize.map(data, 'name').should.be.an.instanceOf(Map);
        });
        it('should return default value', () => {
            const expected = new Map<string, string>(),
                data = {name: null};
            Deserialize.map(data, 'name', expected).should.equal(expected);
        });
        it('should throw when value missing', () => {
            const expected = 'Field name is required',
                data = {};
            chai.expect(() => Deserialize.map(data, 'name')).to.throw(expected);
        });
        it('should return map clone of object input', () => {
            const limit = 10,
                names = Array(limit).fill(undefined),
                values = Array(limit).fill(undefined),
                data = {name: {}};
            for (let i = 0; i < limit; i += 1) {
                names[i] = `name${Math.random()}`;
                values[i] = `value${Math.random()}`;
                data.name[names[i]] = values[i];
            }
            const result = Deserialize.map(data, 'name');
            result.size.should.equal(limit);
            for (let i = 0; i < limit; i += 1) {
                result.get(names[i]).should.equal(values[i]);
            }
        });
        it('should merge defaults with values', () => {
            const limit = 10,
                names = Array(limit).fill(undefined),
                values = Array(limit).fill(undefined),
                data = {name: {}},
                defaults = new Map<string, string>([
                    ['alpha', '42'],
                    ['beta', 'socks']
                ]);
            for (let i = 0; i < limit; i += 1) {
                names[i] = `name${Math.random()}`;
                values[i] = `value${Math.random()}`;
                data.name[names[i]] = values[i];
            }
            const result = Deserialize.map(data, 'name', defaults);
            result.size.should.equal(limit + 2);
            result.get('alpha').should.equal('42');
            result.get('beta').should.equal('socks');
            for (let i = 0; i < limit; i += 1) {
                result.get(names[i]).should.equal(values[i]);
            }
        });
    });
});

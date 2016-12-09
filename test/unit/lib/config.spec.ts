import * as chaiAsPromised from 'chai-as-promised';
import * as chaiString from 'chai-string';
import * as chai from 'chai';

chai.use(chaiAsPromised);
chai.use(chaiString);
chai.should();

//import * as sinon from 'sinon';

//import 'sinon-as-promised';

//import {Deserialize} from '../../../lib/helpers/deserialize';
import {CheckConfig, StatusConfig, StatusList} from '../../../lib/config';

describe('config.ts', () => {
    describe('CheckConfig', () => {
        describe('deserialize', () => {
            it('should require `rootUri`', () => {
                const data = {
                    rootUri: undefined
                };
                chai.expect(() => CheckConfig.deserialize(data)).to.throw('Field rootUri is required');
            });
            it('should require `uriTemplate`', () => {
                const data = {
                    rootUri: 'foo',
                    uriTemplate: undefined
                };
                chai.expect(() => CheckConfig.deserialize(data)).to.throw('Field uriTemplate is required');
            });
            it('should require `servers`', () => {
                const data = {
                    rootUri: 'foo',
                    uriTemplate: 'bar',
                    servers: undefined
                };
                chai.expect(() => CheckConfig.deserialize(data)).to.throw('Field servers is required');
            });
            it('should require `endpoints`', () => {
                const data = {
                    rootUri: 'foo',
                    uriTemplate: 'bar',
                    servers: [],
                    endpoints: undefined
                };
                chai.expect(() => CheckConfig.deserialize(data)).to.throw('Field endpoints is required');
            });
            it('should allow omitted databaseTemplate', () => {
                const data = {
                    rootUri: 'foo',
                    uriTemplate: 'bar',
                    servers: [],
                    endpoints: [],
                    customHeaders: {},
                    databaseTemplate: undefined,
                    cootiesThreshold: 30,
                    pollDelay: 4,
                    status: {},
                    compression: true,
                    requestTimeout: 5
                };
                chai.expect(() => CheckConfig.deserialize(data)).to.not.throw();
            });
            it('should allow omitted cootiesThreshold', () => {
                const data = {
                    rootUri: 'foo',
                    uriTemplate: 'bar',
                    servers: [],
                    endpoints: [],
                    customHeaders: {},
                    databaseTemplate: 'baz',
                    cootiesThreshold: undefined,
                    pollDelay: 4,
                    status: {},
                    compression: true,
                    requestTimeout: 5
                };
                chai.expect(() => CheckConfig.deserialize(data)).to.not.throw();
            });
            it('should allow omitted pollDelay', () => {
                const data = {
                    rootUri: 'foo',
                    uriTemplate: 'bar',
                    servers: [],
                    endpoints: [],
                    customHeaders: {},
                    databaseTemplate: 'baz',
                    cootiesThreshold: 30,
                    pollDelay: undefined,
                    status: {},
                    compression: true,
                    requestTimeout: 5
                };
                chai.expect(() => CheckConfig.deserialize(data)).to.not.throw();
            });
            it('should allow omitted status', () => {
                const data = {
                    rootUri: 'foo',
                    uriTemplate: 'bar',
                    servers: [],
                    endpoints: [],
                    customHeaders: {},
                    databaseTemplate: 'baz',
                    cootiesThreshold: 30,
                    pollDelay: 4,
                    status: undefined,
                    compression: true,
                    requestTimeout: 5
                };
                chai.expect(() => CheckConfig.deserialize(data)).to.not.throw();
            });
            it('should allow omitted compression', () => {
                const data = {
                    rootUri: 'foo',
                    uriTemplate: 'bar',
                    servers: [],
                    endpoints: [],
                    customHeaders: {},
                    databaseTemplate: 'baz',
                    cootiesThreshold: 30,
                    pollDelay: 4,
                    status: {},
                    compression: undefined,
                    requestTimeout: 5
                };
                chai.expect(() => CheckConfig.deserialize(data)).to.not.throw();
            });
            it('should allow omitted requestTimeout', () => {
                const data = {
                    rootUri: 'foo',
                    uriTemplate: 'bar',
                    servers: [],
                    endpoints: [],
                    customHeaders: {},
                    databaseTemplate: 'baz',
                    cootiesThreshold: 30,
                    pollDelay: 4,
                    status: {},
                    compression: true,
                    requestTimeout: undefined
                };
                chai.expect(() => CheckConfig.deserialize(data)).to.not.throw();
            });
        });
    });
    describe('StatusList', () => {
        describe('deserialize()', () => {
            it('should set `offline`', () => {
                const expected = `name ${Math.random()}`;
                StatusList.deserialize({offline: {display: expected}}).offline.display.should.equal(expected);
            });
            it('should set defaults for `offline`', () => {
                const control = new StatusList().offline,
                    actual = StatusList.deserialize({}).offline;
                actual.display.should.deep.equal(control.display);
                actual.maxWait.should.deep.equal(control.maxWait);
                actual.baseSatisfaction.should.deep.equal(control.baseSatisfaction);
                actual.flavors.should.deep.equal(control.flavors);
            });
            it('should set `terrible`', () => {
                const expected = `name ${Math.random()}`;
                StatusList.deserialize({terrible: {display: expected}}).terrible.display.should.equal(expected);
            });
            it('should set defaults for `terrible`', () => {
                const control = new StatusList().terrible,
                    actual = StatusList.deserialize({}).terrible;
                actual.display.should.deep.equal(control.display);
                actual.maxWait.should.deep.equal(control.maxWait);
                actual.baseSatisfaction.should.deep.equal(control.baseSatisfaction);
                actual.flavors.should.deep.equal(control.flavors);
            });
            it('should set `bad`', () => {
                const expected = `name ${Math.random()}`;
                StatusList.deserialize({bad: {display: expected}}).bad.display.should.equal(expected);
            });
            it('should set defaults for `bad`', () => {
                const control = new StatusList().bad,
                    actual = StatusList.deserialize({}).bad;
                actual.display.should.deep.equal(control.display);
                actual.maxWait.should.deep.equal(control.maxWait);
                actual.baseSatisfaction.should.deep.equal(control.baseSatisfaction);
                actual.flavors.should.deep.equal(control.flavors);
            });
            it('should set `ok`', () => {
                const expected = `name ${Math.random()}`;
                StatusList.deserialize({ok: {display: expected}}).ok.display.should.equal(expected);
            });
            it('should set defaults for `ok`', () => {
                const control = new StatusList().ok,
                    actual = StatusList.deserialize({}).ok;
                actual.display.should.deep.equal(control.display);
                actual.maxWait.should.deep.equal(control.maxWait);
                actual.baseSatisfaction.should.deep.equal(control.baseSatisfaction);
                actual.flavors.should.deep.equal(control.flavors);
            });
            it('should set `good`', () => {
                const expected = `name ${Math.random()}`;
                StatusList.deserialize({good: {display: expected}}).good.display.should.equal(expected);
            });
            it('should set defaults for `good`', () => {
                const control = new StatusList().good,
                    actual = StatusList.deserialize({}).good;
                actual.display.should.deep.equal(control.display);
                actual.maxWait.should.deep.equal(control.maxWait);
                actual.baseSatisfaction.should.deep.equal(control.baseSatisfaction);
                actual.flavors.should.deep.equal(control.flavors);
            });
            it('should set `great`', () => {
                const expected = `name ${Math.random()}`;
                StatusList.deserialize({great: {display: expected}}).great.display.should.equal(expected);
            });
            it('should set defaults for `great`', () => {
                const control = new StatusList().great,
                    actual = StatusList.deserialize({}).great;
                actual.display.should.deep.equal(control.display);
                actual.maxWait.should.deep.equal(control.maxWait);
                actual.baseSatisfaction.should.deep.equal(control.baseSatisfaction);
                actual.flavors.should.deep.equal(control.flavors);
            });
            it('should set `awesome`', () => {
                const expected = `name ${Math.random()}`;
                StatusList.deserialize({awesome: {display: expected}}).awesome.display.should.equal(expected);
            });
            it('should set defaults for `awesome`', () => {
                const control = new StatusList().awesome,
                    actual = StatusList.deserialize({}).awesome;
                actual.display.should.deep.equal(control.display);
                actual.maxWait.should.deep.equal(control.maxWait);
                actual.baseSatisfaction.should.deep.equal(control.baseSatisfaction);
                actual.flavors.should.deep.equal(control.flavors);
            });
        });
    });
    describe('StatusConfig', () => {
        describe('deserialize()', () => {
            it('should set `display`', () => {
                const expected = `name ${Math.random()}`;
                StatusConfig.deserialize({display: expected}).display.should.equal(expected);
            });
            it('should use `\'\'` as ultimate default for `display`', () => {
                StatusConfig.deserialize({}).display.should.equal('');
            });
            it('should set `display` from defaults', () => {
                const expected = `name ${Math.random()}`,
                    defaults = new StatusConfig();
                defaults.display = expected;
                StatusConfig.deserialize({}, defaults).display.should.equal(expected);
            });
            it('should set `maxWait`', () => {
                const expected = Math.random() * 10;
                StatusConfig.deserialize({maxWait: expected}).maxWait.should.equal(expected);
            });
            it('should use `0` as ultimate default for `maxWait`', () => {
                StatusConfig.deserialize({}).maxWait.should.equal(0);
            });
            it('should validate limits  for `maxWait`', () => {
                chai.expect(() => StatusConfig.deserialize({maxWait: -1})).to.throw;
                chai.expect(() => StatusConfig.deserialize({maxWait: 0})).to.not.throw;
                chai.expect(() => StatusConfig.deserialize({maxWait: 30})).to.not.throw;
                chai.expect(() => StatusConfig.deserialize({maxWait: 31})).to.throw;
            });
            it('should set `maxWait` from defaults', () => {
                const expected = Math.random() * 10,
                    defaults = new StatusConfig();
                defaults.maxWait = expected;
                StatusConfig.deserialize({}, defaults).maxWait.should.equal(expected);
            });
            it('should set `baseSatisfaction`', () => {
                const expected = Math.random() * 10;
                StatusConfig.deserialize({baseSatisfaction: expected}).baseSatisfaction.should.equal(expected);
            });
            it('should use `0` as ultimate default for `baseSatisfaction`', () => {
                StatusConfig.deserialize({}).baseSatisfaction.should.equal(0);
            });
            it('should validate limits  for `baseSatisfaction`', () => {
                chai.expect(() => StatusConfig.deserialize({baseSatisfaction: -1})).to.throw;
                chai.expect(() => StatusConfig.deserialize({baseSatisfaction: 0})).to.not.throw;
                chai.expect(() => StatusConfig.deserialize({baseSatisfaction: 100})).to.not.throw;
                chai.expect(() => StatusConfig.deserialize({baseSatisfaction: 101})).to.throw;
            });
            it('should set `baseSatisfaction` from defaults', () => {
                const expected = Math.random() * 10,
                    defaults = new StatusConfig();
                defaults.baseSatisfaction = expected;
                StatusConfig.deserialize({}, defaults).baseSatisfaction.should.equal(expected);
            });
            it('should set `flavors`', () => {
                const expected = [`Math.random() * 10`];
                StatusConfig.deserialize({flavors: expected}).flavors.should.equal(expected);
            });
            it('should use `[\'\']` as ultimate default for `flavors`', () => {
                const expected = [`Math.random() * 10`];
                StatusConfig.deserialize({flavors: expected}).flavors.should.equal(expected);
            });
            it('should set `flavors` from defaults', () => {
                const expected = [`Math.random() * 10`],
                    defaults = new StatusConfig();
                defaults.flavors = expected;
                StatusConfig.deserialize({}, defaults).flavors.should.equal(expected);
            });
        });
    });
});

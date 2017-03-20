import * as chaiAsPromised from 'chai-as-promised';
import * as chaiString from 'chai-string';
import * as chai from 'chai';

chai.use(chaiAsPromised);
chai.use(chaiString);
chai.should();

import * as sinon from 'sinon';

import 'sinon-as-promised';

import * as Request from 'request';

import {CheckConfig} from '../../../lib/config';
import {CheckStatus, CheckResult} from '../../../lib/checks';

class StatusObject {
    public statusCode: number;
}

describe('checks.ts', () => {
    describe('CheckStatus', () => {
        let url: string, server: string, endpoint: string, config: CheckConfig;
            beforeEach(() => {
                url = `URL${Math.random()}LRU`;
                server = `SERVER${Math.random()}REVRES`;
                endpoint = `ENDPOINT${Math.random()}TNIOPDNE`;
                config = new CheckConfig();
                config.rootUri = `ROOT${Math.random()}TOOR`;
                config.name = `NAME${Math.random()}EMAN`;
            });
        describe('replaceValues()', () => {
            let replace: (input: string) => string;
            beforeEach(() => {
                replace = (input: string): string => CheckStatus.replaceValues(input, url, server, endpoint, config);
            });
            it('should replace url placeholder', () => {
                return replace('%url%').should.equal(url);
            });
            it('should replace server placeholder', () => {
                return replace('%server%').should.equal(server);
            });
            it('should replace endpoint placeholder', () => {
                return replace('%endpoint%').should.equal(endpoint);
            });
            it('should replace rootUri placeholder', () => {
                return replace('%rootUri%').should.equal(config.rootUri);
            });
            it('should replace name placeholder', () => {
                return replace('%name%').should.equal(config.name);
            });
            it('should replace multiple placeholders', () => {
                return replace('%url%/%url%/%url%/%url%').should.equal(`${url}/${url}/${url}/${url}`);
            });
            it('should replace multiple placeholders 2', () => {
                return replace('%url%/%name%/%server%/%endpoint%').should.equal(`${url}/${config.name}/${server}/${endpoint}`);
            });
        });
        describe('checkHttp()', () => {
            let sandbox: Sinon.SinonSandbox = null,
                stubRequestHead: Sinon.SinonStub = null,
                requestResult: StatusObject,
                checkHttp: () => Promise<CheckResult>;
            beforeEach(() => {
                sandbox = sinon.sandbox.create();
                requestResult = {
                    statusCode: 200
                };
                stubRequestHead = sandbox.stub(Request, 'head').yields(null, requestResult);
                checkHttp =  (): Promise<CheckResult> => CheckStatus.checkHttp(server, endpoint, config);
            });
            afterEach(() => sandbox.restore());
            it('should call Request.head()', () => {
                return checkHttp().then(() => {
                    stubRequestHead.callCount.should.equal(1);
                });
            });
            it('should calculate URL', () => {
                config.uriTemplate = 'http://%rootUri%/%endpoint%';
                let expected = `http://${config.rootUri}/${endpoint}`;
                return checkHttp().then(() => {
                    stubRequestHead.firstCall.args[0].url.should.equal(expected);
                });
            });
            it('should set headers', () => {
                config.customHeaders = new Map <string, string>([
                    ['one', '1'],
                    ['two', '2'],
                    ['three', '3'],
                    ['four', '4'],
                    ['five', '5']
                ]);
                return checkHttp().then(() => {
                    stubRequestHead.firstCall.args[0].headers.should.eql({
                        one: '1',
                        two: '2',
                        three: '3',
                        four: '4',
                        five: '5'
                    });
                });
            });
            it('should set headers with replacements', () => {
                config.customHeaders = new Map <string, string>([
                    ['one', '%url%']
                ]);
                return checkHttp().then(() => {
                    let options = stubRequestHead.firstCall.args[0];
                    options.headers.should.eql({
                        one: options.url
                    });
                });
            });
            it('should select httpStatus', () => {
                let code = Math.round(Math.random() * 400 + 100);
                requestResult.statusCode = code;
                return checkHttp().then((result: CheckResult) => {
                    result.httpStatus.should.equal(code);
                });
            });
            it('should select default httpStatus when status not provided', () => {
                stubRequestHead.yields(undefined, undefined);
                return checkHttp().then((result: CheckResult) => {
                    result.httpStatus.should.equal(599);
                });
            });
            it('should select httpStatus on error', () => {
                let code = Math.round(Math.random() * 400 + 100);
                requestResult.statusCode = code;
                stubRequestHead.yields(new Error('error'), requestResult);
                return checkHttp().then((result: CheckResult) => {
                    result.httpStatus.should.equal(code);
                });
            });
            it('should select default httpStatus when status not provided on error', () => {
                stubRequestHead.yields(new Error('error'), undefined);
                return checkHttp().then((result: CheckResult) => {
                    result.httpStatus.should.equal(599);
                });
            });
        });
        describe('checkStatus()', () => {
            let sandbox: Sinon.SinonSandbox = null,
                stubCheckHttp: Sinon.SinonStub = null;
            beforeEach(() => {
                sandbox = sinon.sandbox.create();
                stubCheckHttp = sandbox.stub(CheckStatus, 'checkHttp').resolves({});
            });
            afterEach(() => sandbox.restore());
            it('should resolve with array', () => {
                config.servers = ['one', 'two'];
                config.endpoints = ['end', 'end2'];
                return CheckStatus.checkStatus(config).then((result: CheckResult[]) => {
                    result.should.be.an.instanceOf(Array);
                    result.should.have.length(4);
                });
            });
            it('should check HTTP for each server', () => {
                config.servers = ['one', 'two'];
                config.endpoints = ['end'];
                return CheckStatus.checkStatus(config).then(() => {
                    stubCheckHttp.callCount.should.equal(2);
                    stubCheckHttp.calledWith('one', 'end').should.be.true;
                    stubCheckHttp.calledWith('two', 'end').should.be.true;
                });
            });
            it('should check HTTP for each endpoint', () => {
                config.servers = ['one'];
                config.endpoints = ['end', 'end2'];
                return CheckStatus.checkStatus(config).then(() => {
                    stubCheckHttp.callCount.should.equal(2);
                    stubCheckHttp.calledWith('one', 'end').should.be.true;
                    stubCheckHttp.calledWith('one', 'end2').should.be.true;
                });
            });
        });
    });
});

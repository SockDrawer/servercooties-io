import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as express from 'express';
import {router, init} from '../../../routes/index';

chai.use(chaiAsPromised);
chai.should();

import 'sinon-as-promised';

interface Route {
    (req: express.Request, res: express.Response): void;
}

describe('index', () => {
    describe('init', () => {
        let sandbox: Sinon.SinonSandbox = null,
            routerGet: Sinon.SinonStub = null;
        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            routerGet = sandbox.stub(router, 'get');
        });
        afterEach(() => sandbox.restore());
        it('should get `/`', () => {
            init();
            routerGet.calledWith('/').should.equal(true);
        });
    });
    describe('route get(`/`)', () => {
        let sandbox: Sinon.SinonSandbox = null,
            routerGet: Function = null,
            getIndex: Route;
        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            const stub = sandbox.stub(router, 'get', (_: string, r: Route) => {
                getIndex = r;
            });
            init();
            routerGet = stub.firstCall.args[1];
        });
        afterEach(() => sandbox.restore());
        it('should render template', () => {
            const res = {
                render: sinon.spy()
            };
            routerGet({}, res);
            res.render.calledWith('index', {title: 'Express'}).should.equal(true);
        });
    });
});

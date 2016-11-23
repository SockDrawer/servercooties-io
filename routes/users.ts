import * as express from 'express';

export const router: express.Router = express.Router();

export const init = (): void => {
    router.get('/', (_: express.Request, res: express.Response) => {
        res.send('respond with a resource');
    });
};


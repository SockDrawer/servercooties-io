import * as express from 'express';

export const userRouter: express.Router = express.Router();

/* GET home page. */
userRouter.get('/', (req: express.Request, res: express.Response) => {
    res.send('respond with a resource');
});

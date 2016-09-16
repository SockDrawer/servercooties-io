import * as express from 'express';


const router: express.Router = express.Router();

const init = (): void => {
    /* GET home page. */
    router.get('/', (req: express.Request, res: express.Response) => {
        res.render('index', {title: 'Express'});
    });
};

export {init, router};

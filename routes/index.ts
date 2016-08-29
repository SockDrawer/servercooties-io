import * as express from 'express';

const indexRouter: express.Router = express.Router();

/* GET home page. */
indexRouter.get('/', (req: express.Request, res: express.Response) => {
    res.render('index', {title: 'Express'});
});

export {indexRouter as indexRouter};

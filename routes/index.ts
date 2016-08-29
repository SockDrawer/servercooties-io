import {Response} from '~express/lib/response';
import {Request} from '~express/lib/request';
import {Router} from '~express/lib/router/index';
import * as express from 'express';
//const express = require('express');

const indexRouter: Router = express.Router();

/* GET home page. */
indexRouter.get('/', (req: Request, res: Response) => {
    res.render('index', {title: 'Express'});
});

export {indexRouter as indexRouter};

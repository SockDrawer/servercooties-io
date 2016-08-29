import {Response} from '~express/lib/response';
import {Request} from '~express/lib/request';
import {Router} from '~express/lib/router/index';

import * as express from 'express';
// const express = require('express');

export const userRouter: Router = express.Router();

/* GET home page. */
userRouter.get('/', (req: Request, res: Response) => {
    res.send('respond with a resource');
});

'use strict';

import * as express from 'express';
import * as CookieParser from 'cookie-parser';
import * as BodyParser from 'body-parser';
import * as Morgan from 'morgan';
import {join as joinPath} from 'path';
import {init as indexInit, router as indexRouter} from './routes/index';
import {init as userInit, router as userRouter} from './routes/users';

//tslint:disable-next-line:no-require-imports
const lessMiddleware = require('less-middleware');

const app: express.Application = express();

indexInit();
userInit();

// view engine setup
app.set('views', joinPath(__dirname, '..', 'views'));
app.set('view engine', 'hbs');

app.use(Morgan('dev'));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: false}));
app.use(CookieParser());

app.use('/public', lessMiddleware(joinPath(__dirname, '..', 'public')));
app.use('/public', express.static(joinPath(__dirname, '..', 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);

class RequestError extends Error {
    public status: number;
}

// catch 404 and forward to error handler
app.use((_: express.Request, __: express.Response, next: Function) => {
    const err: RequestError = new RequestError('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err: RequestError, _: express.Request, res: express.Response) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: RequestError, _: express.Request, res: express.Response) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

export = app;

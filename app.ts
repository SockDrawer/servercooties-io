'use strict';

import {Application} from '~express/lib/application';
import {Request} from '~express/lib/request';
import {Response} from '~express/lib/response';


import * as express from 'express';
import * as CookieParser from 'cookie-parser';
import * as BodyParser from 'body-parser';
import * as Morgan from 'morgan';

import {join as joinPath} from 'path';

import {indexRouter as routes} from './routes/index';
import {userRouter as users} from './routes/users';

const app: Application = express();

// view engine setup
app.set('views', joinPath(__dirname, '../views'));
app.set('view engine', 'hbs');

app.use(Morgan('dev'));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: false}));
app.use(CookieParser());

// TODO: less-middleware is being mean to me. Figure out why i can't import it later. (i'm probably using the wrong syntax)
// tslint:disable-next-line:no-require-imports
app.use(require('less-middleware')(joinPath(__dirname, 'public')));

// Serve static files (for dev. nginx should do this in prod)
app.use(express.static(joinPath(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

class RequestError extends Error {
    public status: number;
}

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: Function) => {
    const err: RequestError = new RequestError('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err: RequestError, req: Request, res: Response) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: RequestError, req: Request, res: Response) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

export = app;

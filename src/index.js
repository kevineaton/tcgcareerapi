import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { parseAuth } from './middleware/auth';
import ConfigClass from './libs/config';

import routes from './routes';

const config = ConfigClass.getConfig();
global.config = config;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  secret: 'tcgcareer'
}));
app.use(helmet());
app.use(parseAuth);

// CORS
app.use((req, res, next) => {
  //very open
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  return next();
});

global.db = ConfigClass.getDb();

// load up the routes
routes(app);

//error handling
app.use((err, req, res, next) => {
  const send = {
    'error': ''
  };
  const http_code = (!err.http_code) ? 500 : err.http_code;
  /* istanbul ignore else */
  if (typeof err.message !== 'undefined' && err.message !== '') {
    send.error = err.message;
  } else {
    if (err.http_code == 400) {
      send.error = 'There was something wrong with that request';
    } else if (err.http_code == 401) {
      send.error = 'You are not authorized to do that';
    } else if (err.http_code == 404) {
      send.error = 'That resource was not found';
    } else {
      send.error = 'There was a problem';
    }
  }
  res.status(http_code).send(send);
  return next();
});

global.app = app;
global.app.listen(config.port);
import * as utils from '../libs/utils';
import * as UsersModel from '../models/users';

/**
 * Routes for interacting with a user
 * 
 * /users/
 *  POST: signup a new user
 * 
 * /users/login
 *  POST: login
 * 
 * /users/:id
 *  GET: get a user profile
 */
export default (app) => {

  app.route('/users')
    .post((req, res, next) => {
      //signup
      //see if the fields are there
      var data = {};
      
      if(req.body.username && req.username !== ''){
        data.username = req.body.username.toLowerCase();
      }
      if(req.body.email && req.email !== ''){
        data.email = req.body.email.toLowerCase();
      }
      if(req.body.password && req.password !== ''){
        data.password = req.body.password;
      }

      if(utils.isEmpty(data)){
        const e = new Error('You must provide a username, email, and password');
        e.http_code = 400;
        return next(e);
      }

      UsersModel.create(data.username, data.email, data.password, {status: 'Verified'})
      .then((result) => {
        // eventually we will want to authenticate but for now, let them be
        return res.send(result);
      })
      .catch(() => {
        const e = new Error('We could not create that account. perhaps that username or email is in use?');
        e.http_code = 400;
        return next(e);
      });
    });

  app.route('/users/login')
    .post((req, res, next) => {
      if(!req.body.loginName || req.body.loginName === '' || !req.body.password || req.body.password === ''){
        const e = new Error('You must provide a loginName and password');
        e.http_code = 400;
        return next(e);
      }

      UsersModel.attemptLogin(req.body.loginName, req.body.password)
      .then((user) => {
        return res.send(user);
      })
      .catch((err) => {
        return next(err);
      });
    });

  app.route('/users/:id')
    .get((req, res, next) => {
      UsersModel.get(req.params.id)
      .then((u) => {
        return res.send(u);
      })
      .catch((e) => {
        return next(e);
      });
    })
    .put((req, res) => {
      const updateData = {};
      if (req.body.password) {
        updateData.password = req.body.password;
      }
      UsersModel.update(req.params.id, updateData)
      .then(() => {
        return res.send({id: req.params.id, success: true});
      });
    });

};
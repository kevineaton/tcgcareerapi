import * as UsersModel from '../models/users';

export default (app) => {

  app.route('/users')
    .post((req, res, next) => {
      //signup
    });

  app.route('/users/login')
    .post((req, res, next) => {

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
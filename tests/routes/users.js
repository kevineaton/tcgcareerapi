import assert from 'assert';
import {
  describe,
  it
} from 'mocha';

import * as UsersModel from '../../src/models/users';
import * as testUtils from '../../src/libs/testUtils';

describe('User routes', () => {
  it('Try to login poorly', (done) => {
    let user = {};
    const rand = Math.random(1000000000) + '';

    testUtils.makeCall('post', 'users/login', {})
    .then((res) => {
      assert.equal(res.code, 400);
      return testUtils.makeCall('post', 'users/login', {loginName: '', password: ''});
    }).catch(() => { return done(); })
    .then((res) => {
      assert.equal(res.code, 400);
      return UsersModel.createForTest({password: rand, username: rand, status: 'Verified'});
    }).catch(() => { return done(); })
    .then((res) => {
      user = res;
      return testUtils.makeCall('post', 'users/login', {loginName: rand, password: rand});
    })
    .then((res) => {
      assert.equal(res.code, 200);
      assert(res.body.jwt);
      return testUtils.makeCall('post', 'users/login', {loginName: rand, password: 'moo'});
    })
    .catch(() => done())
    .then((res) => {
      assert.equal(res.code, 401);
      return UsersModel.del(user.id);
    })
    .catch((err) => done(err))
    .then(() => done());
  });

  it('Get a user', (done) => {
    let user = {};
    UsersModel.createForTest({})
    .then((res) => {
      user = res;
      return testUtils.makeCall('get', 'users/0', {});
    })
    .then((res) => {
      assert.equal(res.code, 404);
      return testUtils.makeCall('get', `users/${user.id}`, {});
    })
    .then((res) => {
      assert.equal(res.code, 200);
      return UsersModel.del(user.id);
    })
    .then(() => {return done();})
    .catch((err) => {return done(err);});
  });

  it('Should signup a user', (done) => {
    let user = {};
    const rand = Math.random(1000000000) + '';

    testUtils.makeCall('post', 'users', {})
    .then((res) => {
      assert.equal(res.code, 400);
      return testUtils.makeCall('post', 'users', {username: rand, password: rand+'', email: rand});
    })
    .then((res) => {
      assert.equal(res.code, 200);
      assert.equal(res.body.username, rand);
      assert.equal(res.body.email, rand);
      user = res;
      return testUtils.makeCall('post', 'users/login', {loginName: rand, password: rand+''});
    })
    .then((res) => {
      assert.equal(res.code, 200);
      assert.equal(res.body.email, rand);
      assert.equal(res.body.username, rand);
      assert(res.body.jwt);
      assert(!res.password);
      return UsersModel.del(user.id);
    })
    .then(() => {return done();})
    .catch((err) => {return done(err);});
  });
});
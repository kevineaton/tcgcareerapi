import assert from 'assert';
import {
  describe,
  it
} from 'mocha';

import * as UsersModel from '../../src/models/users';
import * as utils from '../../src/libs/utils';

describe('User Models tests', () => {
  it('Should get a user that does not exist', (done) => {
    UsersModel.get(0)
    .then((res) => {
      assert(utils.isEmpty(res), 'User is empty');
      done();
    })
    .catch(() => {
      assert(true);
      done();
    });
  });

  it('Should create and retrieve', (done) => {
    const rand = Math.random(1000000000);
    let user = {};
    UsersModel.create(`test-${rand}`, `test-${rand}@tcgcareer.com`, `${rand}!@#`)
    .then((res) => {
      return UsersModel.get(res.id);
    })
    .then((retUser) => {
      assert(retUser.id);
      user = retUser;
      return UsersModel.del(user.id);
    })
    .then(() => {
      return UsersModel.get(user.id);
    })
    .then(() => {
      assert.fail('Should not have found the user');
      done();
    })
    .catch(() => {
      done();
    });
  });

  it('Should create and update a user', (done) => {
    const rand = Math.random(1000000000);
    let user = {};
    UsersModel.create(`test-${rand}`, `test-${rand}@tcgcareer.com`, `${rand}!@#`)
    .then((res) => {
      return UsersModel.get(res.id);
    })
    .then((retUser) => {
      assert(retUser.id);
      user = retUser;
      return UsersModel.update(retUser.id, {password: 'moooooooo', status: 'Verified'})
    })
    .then((result) => {
      assert(result.success);
      return UsersModel.get(user.id);
    })
    .then((result) => {
      assert.equal(result.status, 'Verified', 'Status is verified');
      return UsersModel.del(user.id);
    })
    .then(() => {
      done();
    })
    .catch(() => {
      assert.fail('It should not fail...');
      done();
    });
  });

  it('Should create with the test helper', (done) => {
    let user1 = {};
    let user2 = {};
    const rand = Math.floor((Math.random() * 10000000) + 1);
    UsersModel.createForTest({})
    .then((res) => {
      user1 = res;
      assert(!utils.isEmpty(user1));
      assert.equal(user1.status, 'Unverified');
      return UsersModel.createForTest({username: rand, email: rand, password: rand, status: 'Verified'});
    })
    .then((res) => {
      user2 = res;
      assert.equal(user2.status, 'Verified');
      assert.equal(user2.username, rand);
      assert.equal(user2.email, rand);
      return UsersModel.del(user1.id);
    })
    .catch((err) => {
      return done(err);
    })
    .then(() => {
      return UsersModel.del(user2.id);
    })
    .then(() => {
      return done();
    })
    .catch((err) => {
      assert.fail(err);
      return done(err);
    });
  });
  
});
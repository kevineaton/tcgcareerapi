import assert from 'assert';
import _ from 'lodash';
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
});
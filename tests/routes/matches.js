import assert from 'assert';
import moment from 'moment';
import {
  describe,
  it
} from 'mocha';

import * as UsersModel from '../../src/models/users';
import * as MatchesModel from '../../src/models/matches';
import * as testUtils from '../../src/libs/testUtils';

describe('Match routes', () => {
  it('Try to get a list of matches', (done) => {
    let user = {};
    let match = {};
    UsersModel.createForTest({status: 'Verified'})
    .then((userRet) => {
      user = userRet;
      return testUtils.makeCall('post', `users/${user.id}/matches`, {});
    })
    .then((res) => {
      assert.equal(res.code, 401);
      const postData = {
        jwt: user.jwt
      };
      return testUtils.makeCall('post', `users/${user.id}/matches`, postData);
    })
    .then((res) => {
      assert.equal(res.code, 400);
      const postData = {
        jwt: user.jwt,
        matchDateTime: moment().format('YYYY-MM-DD HH:mm:00'),
        outcome: 'Win',
        gameId: 1
      };
      return testUtils.makeCall('post', `users/${user.id}/matches`, postData);
    })
    .then((res) => {
      assert.equal(res.code, 200);
      match = res.body;
      return UsersModel.del(user.id);
    })
    .then(() => {return MatchesModel.del(match.id); })
    .then(() => {return done();})
    .catch((err) => {return done(err);});
  });
});
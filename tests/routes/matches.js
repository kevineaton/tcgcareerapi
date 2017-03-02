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

      return testUtils.makeCall('get', `users/${user.id}/matches`, {jwt: user.jwt});
    })
    .then((res) => {
      assert.equal(res.code, 200);
      assert.equal(res.body.length, 0);
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
      return testUtils.makeCall('get', `users/${user.id}/matches`, {});
    })
    .then((res) => {
      assert.equal(res.code, 401);
      return testUtils.makeCall('get', `users/${user.id}/matches`, {jwt: user.jwt});
    })
    .then((res) => {
      assert.equal(res.code, 200);
      assert.equal(res.body.length, 1);
      return UsersModel.del(user.id);
    })
    .then(() => {return MatchesModel.del(match.id); })
    .then(() => {return done();})
    .catch((err) => {return done(err);});
  });

  it('Should test sorting', (done) => {
    let user = {};
    let matchesStore = [];
    UsersModel.createForTest({status: 'Verified'})
    .then((userRet) => {
      user = userRet;
      return MatchesModel.create(user.id, moment().subtract(3, 'days').format('YYYY-MM-DD HH:mm:00'), 'Win', {gameId: 1});
    })
    .then((match) => {
      matchesStore.push(match);
      return MatchesModel.create(user.id, moment().subtract(8, 'days').format('YYYY-MM-DD HH:mm:00'), 'Loss', {gameId: 1});
    })
    .then((match) => {
      matchesStore.push(match);
      return MatchesModel.create(user.id, moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:00'), 'Loss', {gameId: 1});
    })
    .then((match) => {
      matchesStore.push(match);
      const optional = {
        jwt: user.jwt
      };

      return testUtils.makeCall('get', `users/${user.id}/matches`, optional);
    })
    .then((matches) => {
      assert.equal(matches.code, 200);
      assert.equal(matches.body.length, 3);
      const optional = {
        sortCol: 'matchDateTime',
        sortDir: 'desc',
        jwt: user.jwt
      };
      return testUtils.makeCall('get', `users/${user.id}/matches`, optional);
    })
    .then((matches) => {
      assert.equal(matches.code, 200);
      assert.equal(matches.body.length, 3);
      assert(moment(matches.body[0].matchDateTime).isAfter(moment(matches.body[1].matchDateTime)));
      assert(moment(matches.body[1].matchDateTime).isAfter(moment(matches.body[2].matchDateTime)));
      const optional = {
        sortCol: 'matchDateTime',
        sortDir: 'asc',
        jwt: user.jwt
      };
      return testUtils.makeCall('get', `users/${user.id}/matches`, optional);
    })
    .then((matches) => {
      assert.equal(matches.code, 200);
      assert.equal(matches.body.length, 3);
      assert(moment(matches.body[0].matchDateTime).isBefore(moment(matches.body[1].matchDateTime)));
      assert(moment(matches.body[1].matchDateTime).isBefore(moment(matches.body[2].matchDateTime)));
      const optional = {
        sortCol: 'outcome',
        sortDir: 'desc',
        jwt: user.jwt
      };
      return testUtils.makeCall('get', `users/${user.id}/matches`, optional);
    })
    .then((matches) => {
      assert.equal(matches.code, 200);
      assert.equal(matches.body.length, 3);
      assert.equal(matches.body[0].outcome, 'Loss');
      assert.equal(matches.body[1].outcome, 'Loss');
      assert.equal(matches.body[2].outcome, 'Win');
      const optional = {
        sortCol: 'outcome',
        sortDir: 'asc',
        jwt: user.jwt
      };
      return testUtils.makeCall('get', `users/${user.id}/matches`, optional);
    })
    .then((matches) => {
      assert.equal(matches.code, 200);
      assert.equal(matches.body.length, 3);
      assert.equal(matches.body[0].outcome, 'Win');
      assert.equal(matches.body[1].outcome, 'Loss');
      assert.equal(matches.body[2].outcome, 'Loss');
      return MatchesModel.del(matchesStore[0].id);
    })
    .then(() => {return MatchesModel.del(matchesStore[1].id);})
    .then(() => {return MatchesModel.del(matchesStore[2].id);})
    .then(() => {return done();})
    .catch((err) => {return done(err);});
  });
});
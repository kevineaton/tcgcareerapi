import assert from 'assert';
import moment from 'moment';
import {
  describe,
  it
} from 'mocha';

import * as UsersModel from '../../src/models/users';
import * as MatchesModel from '../../src/models/matches';
import * as utils from '../../src/libs/utils';

describe('Matches Models tests', () => {
  it('Should get a match that does not exist', (done) => {
    MatchesModel.get(0)
    .then((res) => {
      assert(utils.isEmpty(res), 'Match is empty');
      done();
    })
    .catch(() => {
      assert(true);
      done();
    });
  });

  it('Should create a new match', (done) => {
    const match = {};
    MatchesModel.create(1, moment().format('YYYY-MM-DD HH:mm:00'), 'Win', {})
    .then((res) => {
      assert(res.id);
      match.id = res.id;
      return MatchesModel.get(match.id);
    })
    .then((matchRet) => {
      assert.equal(match.id, matchRet.id);
      assert.equal(match.outcome, 'Win');
      assert.equal(match.userId, 1);
      return MatchesModel.del(match.id);
    })
    .then(() => {
      return MatchesModel.get(match.id);
    })
    .then(() => {
      assert.fail('Should have been missing');
      done();
    })
    .catch((err) => {
      assert(err !== null);
      done();
    });
  });
});
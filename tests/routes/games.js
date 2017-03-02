import assert from 'assert';
import {
  describe,
  it
} from 'mocha';

import * as testUtils from '../../src/libs/testUtils';

describe('Games routes', () => {
  it('Try to get a list of games', (done) => {

    testUtils.makeCall('get', 'games', {})
    .then((res) => {
      assert.equal(res.code, 200);
      assert(res.body.games.length > 0);
      return done();
    })
    .catch((err) => done(err));
  });
});
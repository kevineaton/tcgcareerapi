import assert from 'assert';
import {
  describe,
  it
} from 'mocha';

import * as GamesModel from '../../src/models/games';
import * as utils from '../../src/libs/utils';

describe('Games Models tests', () => {
  it('Should get all of the games on the platform', (done) => {
    let firstGame = {};
    GamesModel.getAll()
    .then((games) => {
      assert(games.length > 0);
      firstGame = games[0];
      return GamesModel.get(games[0].id);
    })
    .then((game) => {
      assert(!utils.isEmpty(game));
      assert.equal(game.id, firstGame.id);
      done();
    });
  });
});
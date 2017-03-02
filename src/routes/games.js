import * as GamesModel from '../models/games';

/**
 * Routes for interacting with games (categories, not matches)
 * 
 * /games
 *  GET: Get all the games on the platform ordered by the game name
 * 
 */
export default (app) => {

  /**
   * Get all of the games currently on the platform
   */
  app.route('/games')
    .get((req, res) => {
      GamesModel.getAll()
      .then((games) => {
        return res.send({games});
      });
    });
};
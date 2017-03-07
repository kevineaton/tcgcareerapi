import moment from 'moment';

import * as utils from '../libs/utils';
import * as UsersModel from '../models/users';
import * as MatchesModel from '../models/matches';

/**
 * Routes for interacting with matches
 * 
 * /users/:userId/matches/
 *  POST: create a match
 * 
 */
export default (app) => {

  /**
   * POST: 
   * matchDateTime - The match date and time in YYYY-MM-DD HH:mm format, required
   * outcome - The outcome of the match, one of: 'Win','Loss','Draw','Incomplete','Practice','Other'
   * gameId - The id of the game, valid games can be retrieved from /games
   * 
   * Optional data:
   * opponentId - The platform id of the opponent
   * opponentName - A free text name of the opponent, only used if opponentId is not set, if empty defaults to Unknown
   * notes - Notes about the match, free text field
   * subWin - If a best of X match, the number of wins
   * subLoss - If a best of X match, the number of losses
   */
  app.route('/users/:userId/matches')
    .post((req, res, next) => {
      const userId = parseInt(req.params.userId);
      if(!req.user.found){ const e = new Error('You must be logged in'); e.http_code = 401; return next(e); }
      if(req.user.id !== userId){ const e = new Error('You can only create matches for yourself'); e.http_code = 401; return next(e); }
      // required fields
      const gameId = req.body.gameId ? req.body.gameId : null;
      const matchDateTime = req.body.matchDateTime ? moment(req.body.matchDateTime).format('YYYY-MM-DD HH:mm:00') : null;
      const outcome = req.body.outcome ? utils.capFirstLetter(req.body.outcome.toLowerCase()) : 'Other';

      if(!gameId || !matchDateTime){
        const e = new Error('You must provide a matchDateTime and a gameId');
        e.http_code = 400;
        return next(e);
      }

      //optional fields
      const optionalData = {};

      if(req.body.opponentId) {
        optionalData.opponentId = req.body.opponentId;
      } else if(req.body.opponentName){
        optionalData.opponentName = req.body.opponentName;
      } else {
        optionalData.opponentName = 'Unknown';
      }

      if(req.body.deckId) {
        // todo: see if deck exists and belongs to the user
        // not implemented yet
      }

      if(req.body.notes) {
        optionalData.notes = req.body.notes.trim();
      }
      
      if(req.body.subWin && req.body.subLoss) {
        optionalData.subWin = req.body.subWin;
        optionalData.subLoss = req.body.subLoss;
      }

      MatchesModel.create(req.user.id, matchDateTime, outcome, optionalData)
      .then((result) => {
        return res.send(result);
      })
      .catch((err) => {
        return next(err);
      });
    })
    .get((req, res, next) => {
      const userId = parseInt(req.params.userId);
      if(!req.user.found){ const e = new Error('You must be logged in'); e.http_code = 401; return next(e); }
      if(req.user.id !== userId){ const e = new Error('You can only see matches for yourself'); e.http_code = 401; return next(e); }
      const data = {sort: req.sort};
      if(req.body.from){
        if(req.body.to){
          data.to = moment(req.body.to).format('YYYY-MM-DD HH:mm:59');
        } else {
          data.to = moment().format('YYYY-MM-DD HH:mm:59');
        }
        data.from = moment().format('YYYY-MM-DD HH:mm:00');
      }
      if(req.body.gameId){
        data.gameId = req.body.gameId;
      }
      
      MatchesModel.getForUser(userId, data)
      .then((matches) => {
        return res.send(matches);
      })
      .catch((err) => {return next(err); });
      
    });

  app.route('/users/:userId/matches/:matchId')
    .get((req, res, next) => {
      if(!req.user.found){ const e = new Error('You must be logged in'); e.http_code = 401; return next(e); }
      if(req.user.id !== req.params.userId){ const e = new Error('You can only create matches for yourself'); e.http_code = 401; return next(e); }
      
      MatchesModel.get(req.params.matchId)
      .then((match) => {
        if(match.userId !== req.user.id) {
          const e = new Error('You cannot view matches for another user');
          e.http_code = 401;
          return next(e);
        }
        return res.send(match);
      })
      .catch((err) => {return next(err); });
    })
    .delete((req, res, next) => {
      if(!req.user.found){ const e = new Error('You must be logged in'); e.http_code = 401; return next(e); }
      if(req.user.id !== req.params.userId){ const e = new Error('You can only create matches for yourself'); e.http_code = 401; return next(e); }
      
      MatchesModel.get(req.params.matchId)
      .then((match) => {
        if(match.userId !== req.user.id) {
          const e = new Error('You cannot delete matches for another user');
          e.http_code = 401;
          return next(e);
        }
        return MatchesModel.del(req.params.matchId);
      })
      .then(() => {
        return res.send({});
      })
      .catch((err) => {return next(err); });
    });

};
import moment from 'moment';
import ConfigClass from '../libs/config';
const db = global.db ? global.db : ConfigClass.getDb();

/** Get a match **/
export function get(matchId) {
  return new Promise((resolve, reject) => {
    db.getConnection((err, c) => {
      c.query('SELECT m.* FROM Matches m WHERE m.id = ?', [matchId], (e, match) => {
        c.release();
        if (e) {
          return reject(e);
        }
        if (match !== null && match.length > 0) {
          return resolve(match[0]);
        } else {
          const e = new Error('That match could not be found');
          e.http_code = 404;
          return reject(e);
        }
      });
    });
  });
}

export function getForUser(userId) {
  return new Promise((resolve, reject) => {
    db.getConnection((err, c) => {
      let query = 'SELECT m.*, g.gameName, g.gameType FROM Matches m, Games g WHERE m.userId = ? AND m.gameId = g.Id ORDER BY m.matchDateTime DESC';
      let values = [userId];
      c.query(query, values, (e, matches) => {
        c.release();
        if (e) {
          return reject(e);
        }
        return resizeBy.next(matches);
      });
    });
  });
}

export function create(userId, matchDateTime, outcome, optionalData){
  return new Promise((resolve, reject) => {
    const params = ['userId', 'matchDateTime', 'outcome'];
    const values = [userId, moment(matchDateTime).format('YYYY-MM-DD HH:mm:00'), outcome];

    if(optionalData.opponentId){
      params.push('opponentId');
      values.push(optionalData.opponentId);
    }

    if(optionalData.opponentName){
      params.push('opponentName');
      values.push(optionalData.opponentName);
    }

    if(optionalData.deckId){
      params.push('deckId');
      values.push(optionalData.deckId);
    }

    if(optionalData.notes){
      params.push('notes');
      values.push(optionalData.notes);
    }

    if(optionalData.subWin){
      params.push('subWin');
      values.push(optionalData.subWin);
    }

    if(optionalData.subLoss){
      params.push('subLoss');
      values.push(optionalData.subLoss);
    }

    if(optionalData.gameId){
      params.push('gameId');
      values.push(optionalData.gameId);
    }

    let paramString = '(';
    let valueString = '(';
    for(let i = 0; i < params.length; i++){
      paramString += params[i] + ',';
      valueString += '?,';
    }
    paramString = paramString.substr(0, paramString.length - 1) + ')';
    valueString = valueString.substr(0, valueString.length - 1) + ')';

    const query = `INSERT INTO Matches ${paramString} VALUES ${valueString}`;

    db.getConnection((err, c) => {
      c.query(query, values, (e, result) => {
        c.release();
        if (e) {
          return reject(e);
        }
        if (result) {
          return resolve({id: result.insertId});
        }
      });
    });
  });
}

export function del(matchId) {
  return new Promise((resolve, reject) => {
    db.getConnection((err, c) => {
      c.query('DELETE FROM Matches WHERE id = ?', [matchId], (e) => {
        c.release();
        if (e) {
          return reject(e);
        }
        return resolve({success: true});
      });
    });
  });
}



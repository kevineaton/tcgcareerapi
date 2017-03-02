import ConfigClass from '../libs/config';
const db = global.db ? global.db : ConfigClass.getDb();

/** Get a match **/
export function get(gameId) {
  return new Promise((resolve, reject) => {
    db.getConnection((err, c) => {
      c.query('SELECT g.* FROM Games g WHERE g.id = ?', [gameId], (e, game) => {
        c.release();
        if (e) {
          return reject(e);
        }
        if (game !== null && game.length > 0) {
          return resolve(game[0]);
        } else {
          const e = new Error('That game could not be found');
          e.http_code = 404;
          return reject(e);
        }
      });
    });
  });
}

export function getAll() {
  return new Promise((resolve, reject) => {
    db.getConnection((err, c) => {
      c.query('SELECT g.* FROM Games g ORDER BY game ASC', [], (e, games) => {
        c.release();
        if (e) {
          return reject(e);
        }
        return resolve(games);
      });
    });
  });
}


import crypto from 'crypto';
import bcrypt from 'bcrypt-nodejs';
import async from 'async';
import moment from 'moment';
import * as utils from '../libs/utils';
import ConfigClass from '../libs/config';
const db = global.db ? global.db : ConfigClass.getDb();

/** Get a user **/
export function get(userId) {
  return new Promise((resolve, reject) => {
    db.getConnection((err, c) => {
      c.query('SELECT * FROM Users WHERE id = ?', [userId], (e, user) => {
        c.release();
        if (e) {
          return reject(e);
        }
        if (user !== null && user.length > 0) {
          delete(user[0].password);
          return resolve(user[0]);
        } else {
          const e = new Error('That user could not be found');
          e.http_code = 404;
          return reject(e);
        }
      });
    });
  });
}

export function stripSensitiveData(user) {
  user.delete('password');
  return user;
}

export function create(username, email, plainPassword) {
  return new Promise((resolve, reject) => {
    const hashed = bcrypt.hashSync(plainPassword, bcrypt.genSaltSync(8), null);
    db.getConnection((err, c) => {
      c.query('INSERT INTO Users (username, email, password, signupDate, status) VALUES (?,?,?,NOW(),"Unverified")', [username, email, hashed], (e, user) => {
        c.release();
        if (e) {
          return reject(e);
        }
        return resolve({
          id: user.insertId
        });
      });
    });
  });
}

export function del(id) {
  return new Promise((resolve, reject) => {
    db.getConnection((err, c) => {
      c.query('DELETE FROM Users WHERE id = ? LIMIT 1', [id], (e) => {
        c.release();
        if (e) {
          return reject(e);
        }
        return resolve({
          success: true
        });
      });
    });
  });
}

export function update(id, data) {
  return new Promise((resolve, reject) => {
    db.getConnection((err, c) => {
      let query = 'UPDATE Users SET ';
      let values = [];

      if (data.email) {
        query += 'Email = ?, ';
        values.push(data.email);
      }

      if (data.password) {
        const hashed = bcrypt.hashSync(data.password, bcrypt.genSaltSync(8), null);
        query += 'Password = ?, ';
        values.push(hashed);
      }

      if (data.status) {
        query += 'Status = ?, ';
        values.push(data.status);
      }

      if (values.length === 0) {
        const e = new Error('You must provide data to update');
        e.http_code = 400;
        return Promise.reject(e);
      }

      query = query.substring(0, query.length - 2) + ' WHERE Id = ? LIMIT 1';
      values.push(id);

      c.query(query, values, (e) => {
        c.release();
        if (e) {
          return reject(e);
        }
        return resolve({
          success: true
        });
      });
    });
  });
}

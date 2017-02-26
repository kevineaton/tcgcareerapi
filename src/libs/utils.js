import _ from 'lodash';
import currency from 'currency-formatter';
import entities from 'entities';
import sanitizeHTML from 'sanitize-html';
import crypto from 'crypto';

export function isEmpty(obj) {
  if (!obj) return true;
  if (obj === null) return true;
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }
  return true;
}

/**
 * Generate Sort Object
 */
export function generateSortObject(sort) {
  const ret = {};
  if (this.isEmpty(sort)) {
    sort = {};
  }
  ret.start = sort.hasOwnProperty('start') && (typeof parseInt('start') === 'number') ? parseInt(sort.start) : 0;
  ret.count = sort.hasOwnProperty('count') && (typeof parseInt('count') === 'number') ? parseInt(sort.count) : 5;
  ret.sortCol = sort.hasOwnProperty('sortCol') ? sort.sortCol : 'Id';
  ret.sortDir = sort.hasOwnProperty('sortDir') ? sort.sortDir : 'DESC';
  return ret;
}

export function convertCurrency(amount) {
  return currency.format((amount / 100), {
    code: 'USD'
  });
}

export function handleError(message, code) {
  const e = new Error(message);
  e.http_code = parseInt(code);
  return e;
}

export function generateJWT(payload) {
  const secret = global.config.salt; 
  const header = {
    'alg': 'HS256',
    'typ': 'JWT'
  };
  const headerBuffer = new Buffer(JSON.stringify(header));
  const headerString = headerBuffer.toString('base64');
  const bodyBuffer = new Buffer(JSON.stringify(payload));
  const bodyString = bodyBuffer.toString('base64');
  const signature = crypto.createHmac('SHA256', secret).update(headerString + '.' + bodyString).digest('base64');
  const signatureBuffer = new Buffer(signature);
  const signatureString = signatureBuffer.toString('base64');
  const token = headerString + '.' + bodyString + '.' + signatureString;
  return token;
}


export function parseJWT(token) {
  if (token === null || token === '') {
    return null;
  }
  const secret = global.config.salt; //replace with better secret from config
  const parts = token.split('.');
  //check signature first
  const headerBuffer = new Buffer(parts[0], 'base64');
  const bodyBuffer = new Buffer(parts[1], 'base64');
  const signatureBuffer = new Buffer(parts[2], 'base64');

  const bodyString = bodyBuffer.toString();
  const signatureString = signatureBuffer.toString();

  const header64 = headerBuffer.toString('base64');
  const body64 = bodyBuffer.toString('base64');

  const body = JSON.parse(bodyString);

  //verify the signature is good
  const signatureToTest = crypto.createHmac('SHA256', secret).update(header64 + '.' + body64).digest('base64');
  if (signatureToTest !== signatureString) {
    return null;
  } else {
    return body;
  }
}

export function parseToken(req) {
  let token = '';
  if(req) {
    if (req.hasOwnProperty('query') && req.query.hasOwnProperty('jwt')) {
      token = req.query.jwt;
    } else if (req.hasOwnProperty('body') && req.body.hasOwnProperty('jwt')) {
      token = req.body.jwt;
    } else if (req.hasOwnProperty('headers') && req.headers.hasOwnProperty('jwt')) {
      token = req.headers.jwt;
    }
  }
  return token;
}

export function sanitizeString(dirty) {
  let res = sanitizeHTML(entities.decodeHTML(dirty), {
    allowedTags: []
  });
  res = res.replace(/&amp;/g, '&');
  return res;
}

export function sortKeysBy(obj, comparator) {
  const keys = _.sortBy(_.keys(obj), (key) => {
    return comparator ? comparator(obj[key], key) : key;
  });

  return _.object(keys, _.map(keys, (key) => {
    return obj[key];
  }));
}
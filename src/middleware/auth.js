import * as utils from '../libs/utils';

export function parseAuth (req, res, next) {
  var token = utils.parseToken(req);
  var parsed = utils.parseJWT(token);
  if (parsed !== null) {
    req.user = parsed;
    req.user.found = true;
  } else {
    req.user = {};
    req.user.found = false;
  }
  return next();
}
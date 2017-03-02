import * as utils from '../libs/utils';

/*
* parseAuth takes in the request and then checks if there is a JWT token
* if one is found then it gets put on the req object as req.user
*/
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
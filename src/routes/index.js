import users from './users';
import matches from './matches';
import games from './games';

export default (app) => {
  users(app);
  matches(app);
  games(app);
};
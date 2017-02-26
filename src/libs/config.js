import mysql from 'mysql';

class ConfigClass {

  constructor() {
    this.__pool = null;
  }

  getConfig() {
    const options = {
      env: process.env.hasOwnProperty('TCG_API_ENV') ? process.env.TCG_API_ENV : 'dev',
      salt: '-tcgcar-20178987!',
      api: process.env.hasOwnProperty('TCG_API_API') ? process.env.TCG_API_API : 'http://localhost:3000/',
      webapp: process.env.hasOwnProperty('TCG_API_WEB') ? process.env.TCG_API_WEB : 'http://localhost:8002/#',
      port: process.env.hasOwnProperty('TCG_API_PORT') ? process.env.TCG_API_PORT : 3000,
    };
    return options;
  }

  getDb() {
    if (this.__pool === null) {
      const options = this.getDbOptions();

      this.__pool = mysql.createPool(options);
      this.__pool.getConnection((err, c) => {
        c.query('set session time_zone ="-5:00"', [], () => {
          c.release();
        });
      });
    }
    return this.__pool;
  }

  getDbOptions() {
    const options = {};
    options.host = process.env.hasOwnProperty('TCG_API_MYSQL_HOST') ? process.env.TCG_API_MYSQL_HOST : 'localhost';
    options.database = process.env.hasOwnProperty('TCG_API_MYSQL_DB') ? process.env.TCG_API_MYSQL_DB : 'tcgcareer';
    options.user = process.env.hasOwnProperty('TCG_API_MYSQL_USER') ? process.env.TCG_API_MYSQL_USER : 'root';
    options.password = process.env.hasOwnProperty('TCG_API_MYSQL_PASS') ? process.env.TCG_API_MYSQL_PASS : 'password';

    options.dateStrings = true;

    return options;
  }
}

export default new ConfigClass();
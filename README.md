# TCG Career API
TCG Career API Server

This is the open-source RESTful API server for the TCG Career service.

## Getting started

If you have never installed or run this server before, make sure you create a database called `tcgcareer` (or call it whatever you want and override the `TCG_API_MYSQL_DB` environment variable). Then, import the `setup/setup.sql` file.

To start the server, clone the repository, run `npm install` then run `npm run dev`

## Contributing

Please feel free to contribute! We are always looking at improving this young service. Always run the tests to make sure things still work and if you change an API return that may break compatbility with clients, ensure you have a good reason and justify it in the Pull Request Comments.

## Notes and Other Considerations

### Promises and MySQL

As of this time, the `mysql` client does not support promises. Eventually, this should probably be swapped up, but right now that is why all of the model methods return new Promises.
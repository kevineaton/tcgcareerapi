# TCG Career API
TCG Career API Server

This is the open-source RESTful API server for the TCG Career service.

## Getting started

To start the server, clone the repository, run `npm install` then run `npm run dev`

## Contributing

Please feel free to contribute! We are always looking at improving this young service.

## Notes and Other Considerations

### Promises and MySQL

As of this time, the `mysql` client does not support promises. Eventually, this should probably be swapped up, but right now that is why all of the model methods return new Promises.
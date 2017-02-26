# tcgcareerapi
TCG Career API Server


## Notes and Other Considerations

### Promises and MySQL

As of this time, the `mysql` client does not support promises. Eventually, this should probably be swapped up, but right now that is why all of the model methods return new Promises.
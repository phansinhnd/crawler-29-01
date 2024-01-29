const { createLogger, format, transports } = require('winston');

const {
  combine, timestamp, prettyPrint,
} = format;

const { NAME } = require('./configs/config');

const logger = createLogger({
  format: combine(
    timestamp(),
    prettyPrint(),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: `./log/${NAME}` }),
  ],
});

module.exports = logger;

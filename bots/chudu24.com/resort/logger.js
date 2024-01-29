const winston = require('winston');
const { NAME } = require('./configs/config');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `./log/${NAME}` }),
  ],
});

module.exports = logger;

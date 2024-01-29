const routes = require('./index');
const logger = require('../logger');

module.exports = (globalContext) => async function (routeName, requestContext) {
  const route = routes[routeName];
  if (!route) throw new Error(`No route for name: ${routeName}`);
  logger.debug(`Invoking route: ${routeName}`);
  return route(requestContext, globalContext);
};

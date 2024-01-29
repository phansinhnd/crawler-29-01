const logger = require('../logger');
const enqueueDetailLinks = require('../actions/enqueueDetailLinks');

module.exports = async ({ $, request }, { requestQueue }) => {
  const title = $('title').text();
  logger.info(`LIST_PAGE: ${request.url}: ${title}`);

  await enqueueDetailLinks({
    $,
    requestQueue,
    userData: request.userData,
  });
};

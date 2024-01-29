const logger = require('../logger');
const enqueueDetailLinks = require('../actions/enqueueDetailLinks');

// eslint-disable-next-line no-unused-vars
module.exports = async ({ $, request, page }, { requestQueue }) => {
  const title = await page.title();
  logger.info(`LIST_PAGE: ${request.url}: ${title}`);

  await enqueueDetailLinks({
    page,
    requestQueue,
    userData: request.userData,
  });
};

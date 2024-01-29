const logger = require('../logger');
const enqueueDetailLinks = require('../actions/enqueueDetailLinks');

module.exports = async ({ $, page, request }, { requestQueue }) => {
  const title = await page.title();
  logger.info(`LIST_PAGE: ${request.url}: ${title}`);

  await enqueueDetailLinks({
    page,
    requestQueue,
    userData: request.userData,
  });
};

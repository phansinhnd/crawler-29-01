const logger = require('../logger');
const enqueueVideoDetailLinks = require('../actions/enqueueVideoDetailLinks');

module.exports = async ({ $, request, page }, { requestQueue }) => {
  const title = await page.title();
  logger.info(`VIDEO_LIST_PAGE: ${request.url}: ${title}`);

  await enqueueVideoDetailLinks({ page, requestQueue, userData: request.userData });
};

const logger = require('../logger');
const enqueueGalleryProfessLinks = require('../actions/enqueueGalleryProfessLinks');
// const enqueueVideoListLinks = require('../actions/enqueueVideoListLinks');

module.exports = async ({ request, page }, { requestQueue }) => {
  const title = await page.title();
  logger.info(`GALLERY_PAGE: ${request.url}: ${title}`);

  await enqueueGalleryProfessLinks({ page, requestQueue, userData: request.userData });
  // await enqueueVideoListLinks({ page, requestQueue, userData: request.userData });
};

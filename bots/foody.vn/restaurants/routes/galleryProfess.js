const Apify = require('apify');
const md5 = require('md5');
const logger = require('../logger');
const { NAME } = require('../configs/config');
const enqueueGallerySpaceLinks = require('../actions/enqueueGallerySpaceLinks');
const getAlbumGalleryLinks = require('../common/getAlbumGalleryLinks');

module.exports = async ({ $, request, page }, { requestQueue }) => {
  const restaurantGalleryProfessDataset = await Apify.openDataset(`${NAME}-gallery`);

  const title = await page.title();
  logger.info(`GALLERY_PROFESS_PAGE: ${request.url}: ${title}`);

  const data = await getAlbumGalleryLinks(page);

  const checkData = await page.evaluate(() => $('.micro-home-album-img').length);

  if (checkData > 0) {
    const uuid = md5(request.url.replace('/album-professional', ''));
    await restaurantGalleryProfessDataset.pushData({
      ...data,
      ...request.userData,
      source_gallery_url: request.url,
      // content_type: 'restaurant_galleries',
      uuid,
    });
  } else {
    await enqueueGallerySpaceLinks({ page, requestQueue, userData: request.userData });
  }
};

const Apify = require('apify');
const md5 = require('md5');
const logger = require('../logger');
const { NAME } = require('../configs/config');
const enqueueGalleryAllLinks = require('../actions/enqueueGalleryAllLinks');
const getAlbumGalleryLinks = require('../common/getAlbumGalleryLinks');

module.exports = async ({ $, request, page }, { requestQueue }) => {
  const restaurantGallerySpaceDataset = await Apify.openDataset(`${NAME}-gallery`);

  const title = await page.title();
  logger.info(`GALLERY_SPACE_PAGE: ${request.url}: ${title}`);

  const data = await getAlbumGalleryLinks(page);

  const checkData = await page.evaluate(() => $('.micro-home-album-img').length);

  if (checkData > 0) {
    const uuid = md5(request.url.replace('/album-khong-gian', ''));
    await restaurantGallerySpaceDataset.pushData({
      ...data,
      ...request.userData,
      source_gallery_url: request.url,
      // content_type: 'restaurant_galleries',
      uuid,
    });
  } else {
    await enqueueGalleryAllLinks({ page, requestQueue, userData: request.userData });
  }
};

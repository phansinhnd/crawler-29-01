const Apify = require('apify');
const md5 = require('md5');
const logger = require('../logger');
const { NAME } = require('../configs/config');
const getAlbumGalleryLinks = require('../common/getAlbumGalleryLinks');

module.exports = async ({ request, page }) => {
  const restaurantGalleryAllDataset = await Apify.openDataset(`${NAME}-gallery`);

  const title = await page.title();
  logger.info(`GALLERY_ALL_PAGE: ${request.url}: ${title}`);

  const data = await getAlbumGalleryLinks(page);

  const uuid = md5(request.url.replace('/album-anh', ''));

  await restaurantGalleryAllDataset.pushData({
    ...data,
    ...request.userData,
    source_gallery_url: request.url,
    // content_type: 'restaurant_galleries',
    uuid,
  });
};

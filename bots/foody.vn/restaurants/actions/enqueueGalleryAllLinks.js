const Apify = require('apify');

const enqueueGalleryAllLinks = ({
  page, requestQueue, selector = '.micro-album-tabs a[href*="/album-anh"]', userData = {},
}) => Apify.utils.enqueueLinks({
  page,
  selector,
  requestQueue,
  transformRequestFunction: (request) => {
    request.userData = { ...request.userData, ...userData, page: 'GALLERY_ALL' };
    return request;
  },
});

module.exports = enqueueGalleryAllLinks;

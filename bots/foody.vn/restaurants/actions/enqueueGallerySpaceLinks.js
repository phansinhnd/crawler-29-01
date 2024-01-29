const Apify = require('apify');

const enqueueGallerySpaceLinks = ({
  page, requestQueue, selector = '.micro-album-tabs a[href*="/album-khong-gian"]', userData = {},
}) => Apify.utils.enqueueLinks({
  page,
  selector,
  requestQueue,
  transformRequestFunction: (request) => {
    request.userData = { ...request.userData, ...userData, page: 'GALLERY_SPACE' };
    return request;
  },
});

module.exports = enqueueGallerySpaceLinks;

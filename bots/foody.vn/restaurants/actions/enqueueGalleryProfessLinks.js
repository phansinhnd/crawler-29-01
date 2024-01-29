const Apify = require('apify');

const enqueueGalleryProfessLinks = ({
  page, requestQueue, selector = '.micro-album-tabs a[href*="/album-professional"]', userData = {},
}) => Apify.utils.enqueueLinks({
  page,
  selector,
  requestQueue,
  transformRequestFunction: (request) => {
    request.userData = { ...request.userData, ...userData, page: 'GALLERY_PROFESS' };
    return request;
  },
});

module.exports = enqueueGalleryProfessLinks;

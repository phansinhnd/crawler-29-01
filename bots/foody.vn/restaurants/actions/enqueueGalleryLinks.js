const Apify = require('apify');

const enqueueGalleryLinks = ({
  page, requestQueue, selector = 'li[data-item-name="album"] > a', userData = {},
}) => Apify.utils.enqueueLinks({
  page,
  selector,
  requestQueue,
  transformRequestFunction: (request) => {
    request.userData = { ...request.userData, ...userData, page: 'GALLERY' };
    return request;
  },
});

module.exports = enqueueGalleryLinks;

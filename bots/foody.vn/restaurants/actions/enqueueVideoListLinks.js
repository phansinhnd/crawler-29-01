const Apify = require('apify');

const enqueueVideoListLinks = ({
  page, requestQueue, selector = '.micro-album-tabs a[href*="/video"]', userData = {},
}) => Apify.utils.enqueueLinks({
  page,
  selector,
  requestQueue,
  transformRequestFunction: (request) => {
    request.userData = { ...request.userData, ...userData, page: 'VIDEO_LIST' };
    return request;
  },
});

module.exports = enqueueVideoListLinks;

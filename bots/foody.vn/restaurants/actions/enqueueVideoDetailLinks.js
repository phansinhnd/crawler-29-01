const Apify = require('apify');

const enqueueVideoDetailLinks = ({
  page, requestQueue, selector = 'ul[data-bind="visible:true"] > li > a', userData = {},
}) => Apify.utils.enqueueLinks({
  page,
  selector,
  requestQueue,
  transformRequestFunction: (request) => {
    request.userData = { ...request.userData, ...userData, page: 'VIDEO_DETAIL' };
    return request;
  },
});

module.exports = enqueueVideoDetailLinks;

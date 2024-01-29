const Apify = require('apify');

const enqueueDetailLinks = ({
  $, requestQueue, selector = '.wapfoody .wapfooter a', userData = {},
}) => Apify.utils.enqueueLinks({
  $,
  selector,
  requestQueue,
  transformRequestFunction: (request) => {
    request.userData = { ...request.userData, ...userData, page: 'DETAIL' };
    return request;
  },
});

module.exports = enqueueDetailLinks;

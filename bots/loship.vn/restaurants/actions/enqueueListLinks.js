const Apify = require('apify');

const enqueueListLinks = ({
  $, requestQueue, selector = '.pagination li a', userData = {},
}) => Apify.utils.enqueueLinks({
  $,
  selector,
  requestQueue,
  transformRequestFunction: (request) => {
    request.userData = { ...request.userData, ...userData, page: 'LIST' };
    return request;
  },
});

module.exports = enqueueListLinks;

const Apify = require('apify');

const enqueueDetailLinks = ({
  $, requestQueue, selector = '.page-body .hotel-item .post-features h2 a', userData = {}, baseUrl = 'https://khachsan.chudu24.com/',
}) => Apify.utils.enqueueLinks({
  $,
  selector,
  requestQueue,
  baseUrl,
  transformRequestFunction: (request) => {
    request.userData = { ...request.userData, ...userData, page: 'DETAIL' };
    return request;
  },
});

module.exports = enqueueDetailLinks;

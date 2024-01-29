const Apify = require('apify');

const enqueueDetailLinks = ({
  page, requestQueue, selector = '.resname > h2 > a', userData = {},
}) => Apify.utils.enqueueLinks({
  page,
  selector,
  requestQueue,
  transformRequestFunction: (request) => {
    request.userData = { ...request.userData, ...userData, page: 'DETAIL' };
    return request;
  },
});

module.exports = enqueueDetailLinks;

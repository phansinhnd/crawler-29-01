const Apify = require('apify');
const logger = require('../logger');

const enqueueDetailLinks = ({
  page, requestQueue, selector = '.vIjFZ .ngXxk>a.BMQDV._F.Gv.wSSLS.SwZTJ.FGwzt.ukgoS', userData = {},
}) => {   return Apify.utils.enqueueLinks({
  page,
  selector,
  requestQueue,
  transformRequestFunction: (request) => {
    logger.info(`DETAIL_PAGE: ${request.url}`)
    request.userData = { ...request.userData, ...userData, page: 'DETAIL' };
    return request;
  },
})};

module.exports = enqueueDetailLinks;

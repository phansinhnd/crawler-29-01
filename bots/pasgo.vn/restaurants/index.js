const Apify = require('apify');
const sources = require('./configs/sources');
const { NAME } = require('./configs/config');

const createRouter = require('./routes/createRouter');
const logger = require('./logger');

Apify.main(async () => {
  const requestList = new Apify.RequestList({
    sources,
  });

  await requestList.initialize();
  const requestQueue = await Apify.openRequestQueue(NAME);

  const errorDataset = await Apify.openDataset(`${NAME}-error`);

  const router = createRouter({ requestQueue });

  const crawler = new Apify.CheerioCrawler({
    requestList,
    requestQueue,
    handlePageFunction: async (context) => {
      const { $, request } = context;
      await router(request.userData.page, { $, request });
    },
    handleFailedRequestFunction: async ({ request }) => {
      logger.error(`FAILED_PAGE: Request ${request.url} failed too many times`);

      await errorDataset.pushData({
        '#debug': Apify.utils.createRequestDebugInfo(request),
        source_url: request.url,
      });
    },
    maxRequestsPerCrawl: 10000000,
    maxConcurrency: 5,
    handlePageTimeoutSecs: 3600,
  });

  await crawler.run();
});

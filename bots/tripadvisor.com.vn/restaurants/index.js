const Apify = require('apify');
const sources = require('./configs/sources');
const { NAME } = require('./configs/config');

const createRouter = require('./routes/createRouter');
const logger = require('./logger');
//
Apify.main(async () => {
  const requestList = new Apify.RequestList({
    sources,
  });

  await requestList.initialize();
  const requestQueue = await Apify.openRequestQueue(NAME);

  const errorDataset = await Apify.openDataset(`${NAME}-error`);

  const router = createRouter({ requestQueue });

  const crawler = new Apify.PuppeteerCrawler({
    requestList,
    requestQueue,
    handlePageFunction: async (context) => {
      // eslint-disable-next-line no-console
      console.log('=====handlePageFunction=====');
      const { request, page } = context;
      await Apify.utils.puppeteer.injectJQuery(page);

      logger.error(request);
      await router(request.userData.page, context);
    },
    handleFailedRequestFunction: async ({ request }) => {
      // eslint-disable-next-line no-console
      console.log('=====handleFailedRequestFunction=====');
      logger.error(`FAILED_PAGE: Request ${request.url} failed too many times`);

      await errorDataset.pushData({
        '#debug': Apify.utils.createRequestDebugInfo(request),
        source_url: request.url,
      });
    },
    maxRequestsPerCrawl: 10000000,
    maxConcurrency: 5,
    handlePageTimeoutSecs: 3600,
    launchPuppeteerOptions: {
      headless: true,
      stealth: true,
      useChrome: false,
    },
  });
  logger.error('=====START=====');
  //
  await crawler.run();
  // eslint-disable-next-line no-console
  console.log('=====END=====');
});

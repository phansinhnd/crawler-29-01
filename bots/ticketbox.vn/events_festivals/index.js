const p = require('phin');

const urlList = 'https://ticketbox.vn/EventList/EventList/LoadEventListData?Offset=0&Limit=2400&TotalCount=28200';

const Apify = require('apify');
const sources = require('./configs/sources');
const { NAME } = require('./configs/config');

const createRouter = require('./routes/createRouter');
const logger = require('./logger');

Apify.main(async () => {
  // Lấy list url detail push source
  const res = await p({
    url: urlList,
    method: 'GET',
    parse: 'json',
  });
  res.body.forEach((element) => {
    const sourceItem = {
      url: element.FullUrl,
      userData: {
        category_lv1_name: 'Sự kiện - Lễ hội',
        page: 'DETAIL',
        name: element.Name,
        lat: element.Venue.Lat,
        long: element.Venue.Long,
        name_origin: element.OrganizerName,
        city: element.Venue.City,
        address: element.Venue.Address,
      },
    };
    sources.push(sourceItem);
  });
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
    maxConcurrency: 500,
    handlePageTimeoutSecs: 3600,
  });

  await crawler.run();
});

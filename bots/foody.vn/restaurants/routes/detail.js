const Apify = require('apify');

const {
  utils: { sleep },
} = Apify;

const md5 = require('md5');
const logger = require('../logger');
const enqueueDetailLinks = require('../actions/enqueueDetailLinks');
const enqueueGalleryLinks = require('../actions/enqueueGalleryLinks');
const getOpenHours = require('../common/getOpenHours');
const { NAME } = require('../configs/config');

module.exports = async ({ $, request, page }, { requestQueue }) => {
  const restaurantDataset = await Apify.openDataset(NAME);

  const title = await page.title();
  logger.info(`DETAIL_PAGE: ${request.url}: ${title}`);

  page.on('console', (consoleObj) => console.log(consoleObj.text()));

  // await page.reload();

  await sleep(3000);

  const showPhone = await page.evaluate(() => $('#show-phone-number').length);
  if (showPhone > 0) {
    logger.info('CLICK_SHOW_PHONE');

    await page.click('#show-phone-number');
  } else {
    logger.info('LIST_PAGE: ENQUEUE_DETAIL_LINKS');

    await enqueueDetailLinks({
      page, requestQueue, selector: '.ldc-item-h-name > h2 > a', userData: request.userData,
    });

    return;
  }

  const showOpenTime = await page.evaluate(() => $('.opening-time-btn').length);
  if (showOpenTime) {
    logger.info('CLICK_SHOW_OPEN_TIME');

    await page.click('.opening-time-btn');
  }

  await sleep(5000);

  const data = await page.evaluate(() => {
    const streetAddress = $('span[itemprop="streetAddress"]').text();
    const addressLocality = $('span[itemprop="addressLocality"]').text();
    const addressRegion = $('span[itemprop="addressRegion"]').text();
    const address = streetAddress.concat(', ', addressLocality, ', ', addressRegion);

    const tels = [];
    $('.microsite-popup-phone-number .res-phone-only').each(function () {
      tels.push($(this).text());
    });

    const lat = $('meta[property="place:location:latitude"]').attr('content');
    const long = $('meta[property="place:location:longitude"]').attr('content');
    const priceRange = $('span[itemprop="priceRange"]')
      .text()
      .replace(/[.đ \n\r]/g, '')
      .split('-')
      .map(Number);

    return {
      lat,
      long,
      loc: {
        type: 'Point',
        coordinates: [parseFloat(long), parseFloat(lat)],
      },
      name: $('.main-info-title h1').text(),
      tel: tels.length >= 1 ? tels[0] : '',
      tels,
      address,
      region_name: addressRegion,
      locality: addressLocality,
      street: streetAddress,
      price: priceRange.length >= 2 ? {
        from: parseFloat(priceRange[0]),
        to: parseFloat(priceRange[1]),
      } : [],
    };
  });

  const openHours = await getOpenHours(page);

  await enqueueGalleryLinks({ page, requestQueue, userData: request.userData });

  await restaurantDataset.pushData({
    ...data,
    open_hours: openHours,
    ...request.userData,
    source_url: request.url,
    content_type: 'restaurants',
    uuid: md5(request.url),
    country_name: 'Việt Nam',
    lang_code: 'vi',
    weight: 999,
    status: 2,
  });
};

const Apify = require('apify');

const md5 = require('md5');
const logger = require('../logger');
const { NAME } = require('../configs/config');

module.exports = async ({ $, request }) => {
  const restaurantDataset = await Apify.openDataset(NAME);

  const title = $('title').text();
  logger.info(`DETAIL_PAGE: ${request.url}: ${title}`);
  const prices = [];
  $('.tic__price strong').each(function () {
    const str = $(this)
      .text()
      .replace(/[^0-9-]/g, '');
    if (str !== '' && str !== undefined && str !== null) {
      prices.push(str);
    }
  });
  prices.sort;
  const range = { from: null, to: null };
  range.from = parseFloat(prices[0]);
  range.to = parseFloat(prices[prices.length - 1]);
  const img = $('meta[property="og:image"]').attr('content');
  const data = {
    loc: null,
    name: $('h1.title').text(),
    region_name: request.userData.city,
    price: range,
    open_hour_name: $('.event-time p').clone().children().remove()
      .end()
      .text()
      .trim(),
    logo_url: img,
    thumbnail_urls: null,
    banner_url: img,
    short_description: $('meta[property="og:description"]').attr('content'),
    description: $('.detail-box .really-height').html(),
    facility_names: null,
  };

  await restaurantDataset.pushData({
    ...data,
    ...request.userData,
    source_url: request.url,
    content_type: 'places',
    uuid: md5(request.url),
    country_name: 'Việt Nam',
    lang_code: 'vi',
    weight: 999,
    status: 2,
  });
};

const Apify = require('apify');

const md5 = require('md5');
const logger = require('../logger');
const { NAME } = require('../configs/config');

module.exports = async ({ $, request }) => {
  const restaurantDataset = await Apify.openDataset(NAME);

  const title = $('title')
    .text();
  logger.info(`DETAIL_PAGE: ${request.url}: ${title}`);

  const albums = [];
  $('#detail-photo .carousel-inner .item')
    .each(function () {
      albums.push($(this)
        .find('img')
        .attr('data-src'));
    });

  const menus = [];
  $('#carousel-price .carousel-inner .item')
    .each(function () {
      menus.push($(this)
        .find('img')
        .attr('src'));
    });

  const facilities = [];
  $('#gioi-thieu img[src="https://cdn.pastaxi-manager.onepas.vn/images/icon-true.png"]')
    .each(function () {
      facilities.push($(this)
        .next('div.text-right')
        .text());
    });

  const locations = $('#dia-chi .content a')
    .attr('href')
    .substring(33)
    .split(',')
    .map(val => parseFloat(val));
  const [lat, long] = locations;

  const priceRange = $('.pasgo-giatrungbinh')
    .text()
    .replace(/[.vnđ/người \n\r]/g, '')
    .split(/[–-]/g)
    .map(Number);

  const data = {
    lat,
    long,
    loc: {
      type: 'Point',
      coordinates: [parseFloat(long), parseFloat(lat)],
    },
    name: $('.pasgo-title')
      .text(),
    address: $('span[itemprop="streetAddress"]')
      .text(),
    region_name: $('#provinceId option[selected]')
      .text(),
    price: priceRange.length >= 2 ? {
      from: parseFloat(priceRange[0]),
      to: parseFloat(priceRange[1]),
    } : [],
    open_hour_name: $('.hours-pickup')
      .attr('content'),
    logo_url: $('meta[property="og:image"]')
      .attr('content'),
    thumbnail_urls: albums.slice(1),
    banner_url: albums.length >= 2 ? albums[1] : '',
    short_description: $('#gioi-thieu div:contains("Điểm đặc trưng:")')
      .next('div.text-description')
      .text(),
    description: $('#gioi-thieu .content')
      .html(),
    facility_names: facilities.join(', '),
    // menus,
  };

  await restaurantDataset.pushData({
    ...data,
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

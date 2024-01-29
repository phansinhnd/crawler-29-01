const Apify = require('apify');
// eslint-disable-next-line import/no-extraneous-dependencies
const cheerio = require('cheerio');

const md5 = require('md5');
const logger = require('../logger');
const { NAME } = require('../configs/config');

module.exports = async ({ $, request }) => {
  const html = $('html').html();
  cheerio.load(html, { xmlMode: true });
  // const str = $('script:not([src])[type="text/javascript"]').eq(3).html();
  // eslint-disable-next-line no-eval
  eval(String($('script:not([src])').eq(5).html()));
  // eslint-disable-next-line no-undef
  const { hotelInfo } = Chudu24.Hotels.HotelDetailDatas;
  const resortDataset = await Apify.openDataset(NAME);
  const title = $('title').text();
  logger.info(`DETAIL_PAGE: ${request.url}: ${title}`);

  const albums = [];
  $('#gallery-1 a').each(function () {
    albums.push($(this).attr('data-rsbigimg'));
  });

  const facilities = [];
  $('.hotel-faci span').each(function () {
    facilities.push($(this).text());
  });

  let shortDescription = '';
  const shortDescriptionFirst = $('.pHotelDes p').length
    ? $('.pHotelDes p').eq(0).text().replace(/(\r\n|\n|\r)/gm, '')
    : $('.pHotelDes').text().replace(/(\r\n|\n|\r)/gm, '');
  const shortDescriptionArray = shortDescriptionFirst.split('.');
  const shortDescriptionSecond = shortDescriptionArray.length > 2 ? shortDescriptionArray[1] : '';
  shortDescription = shortDescriptionArray.slice(0, 1).join('.');
  const lastShortDescription = shortDescription.split(' ').pop();

  let description = '';
  const descriptionArray = $('.pHotelDes').html().split('.');
  description = descriptionArray.slice(1).join('.');


  if (lastShortDescription === 'TP' || shortDescriptionSecond.indexOf('km.') !== -1) {
    shortDescription = shortDescriptionFirst.split('.').slice(0, 2).join('.');
    description = descriptionArray.slice(2).join('.');
  }

  const lat = hotelInfo.pointerlatitude;
  const long = hotelInfo.pointerlongtitude;

  const data = {
    loc: {
      type: 'Point',
      coordinates: [parseFloat(long).toFixed(8), parseFloat(lat).toFixed(8)],
    },
    name: hotelInfo.hotelname.replace('amp;', ''),
    address: hotelInfo.fullAddress,
    region_name: hotelInfo.cityname,
    open_hour_name: `Giờ nhận phòng: ${hotelInfo.checkouttime} Giờ trả phòng: ${hotelInfo.checkouttime}`,
    logo_url: hotelInfo.thumbnail,
    map_url: hotelInfo.mapthumbnail,
    thumbnail_urls: albums,
    banner_url: albums.length >= 2 ? albums[1] : '',
    shortDescription: `${shortDescription.replace('amp;', '')}.`,
    description: description.replace(/<\/?strong>|amp;/g, ''),
    facility_names: facilities,
    country_name: hotelInfo.country_id,
    standard_rate: hotelInfo.starrating,
    tel: hotelInfo.contactreservationphone.replace(';', ','),
  };
  //
  console.log(request.url);
  await resortDataset.pushData({
    ...data,
    ...request.userData,
    source_url: request.url,
    content_type: 'hotels',
    type: 'Hotel',
    uuid: md5(request.url),
    countryCode: 'VN',
    langCode: 'vi',
    weight: 999,
    status: 2,
  });
};

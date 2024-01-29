const md5 = require('md5');
require('dotenv').config();
const p = require('phin');
const logger = require('./logger');

const {SYNC_URL} = process.env;
const contentType = 'hotels';
const category = 'Homestay';

const LIMIT = 20;
const url = 'https://www.luxstay.com/api/search/destination';
const urlDetail = 'https://www.luxstay.com/api/rooms/';

let page;
let item;
let resDetail;
let reslist;
let info;
const params = {
  limit: LIMIT,
  page: 1,
  path: '/vietnam',
};

async function saveItem(element) {
  // axios.post(SYNC_URL, );
  const res = await p({
    url: SYNC_URL,
    method: 'POST',
    parse: 'json',
    data: element,
  });
  logger.info(res.body);
  logger.info(`save: ${element.name}`);
}

async function processList(data) {
  for (item of data) {
    try {
      resDetail = await p({
        url: urlDetail + item.id,
        method: 'GET',
        parse: 'json',
        // data: params,
        core: {
          'content-currency': 'VND',
        },
      });
    } catch (error) {
      console.error(error);
    }
    info = resDetail.body.data;
    logger.info(`item ${info.name}`);
    item = {
      name: info.name,
      lat: info.address.data.latitude,
      long: info.address.data.longitude,
      source_url: info.url,
      loc: {
        type: 'Point',
        coordinates: [
          info.address.data.longitude,
          info.address.data.latitude,
        ],
      },
      price: {from: info.price.data.nightly_price_vnd, to: ''},
      tel: '',
      address: info.address.data.full_address,
      country_name: info.address.data.country,
      region_name: info.address.data.state,
      open_hour_names: `Giờ checkin: ${info.price.data.checkin_time}, Giờ checkout: ${info.price.data.checkout_time} `,
      description: info.introduction,
      standard_rate: '',
      short_description: '',
      facility_names: info.amenities.data.map((sweetItem) => sweetItem.name).join(),
      content_type: contentType,
      uuid: md5(info.url),
      lang_code: 'vi',
      category_lv1_name: category,
      page: 'DETAIL',
      weight: 999,
      status: 2,
      logo_url: info.featured_photo,
      map_url: '',
      thumbnail_urls: info.photos.data.map((sweetItem) => sweetItem.photo_url),
      banner_url: info.featured_photo,
    };
    saveItem(item);
  }
}

async function getHome() {
  const results = [];
  try {
    const response = await p({
      url,
      method: 'POST',
      data: params,
      parse: 'json',
      core: {
        'content-currency': 'VND',
      },
    });
    const TOTAL_PAGE = response.body.meta.pagination.total_pages;
    for (page = 1; page < TOTAL_PAGE; page++) {
      params.page = page;
      try {
        const reslist = await p(
            {
              url,
              method: 'POST',
              data: params,
              parse: 'json',
            },
        );
        processList(reslist.body.data);
      } catch (e) {
        console.log(e);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

getHome();

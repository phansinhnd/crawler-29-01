const cheerio = require('cheerio');
const md5 = require('md5');
const low = require('lowdb');

const FileSync = require('lowdb/adapters/FileSync');

const dbSave = low(new FileSync('db_save.json'));
const {
  COUNTRY, LANG_CODE, STATUS, WEIGHT, DOMAIN, DOMAIN_FULL,
} = require('../define');
const { sentHttp } = require('./sentHttp');
const { getTels } = require('./getTels');
const { getOpenHour } = require('./getOpenHour');
const { getThumbnailUrls } = require('./getThumbnailUrls');

exports.crawlerPage = async function crawlerPage(urlDetail, category_lv1_name = '', category_lv2_name = '', type = 'restaurants') {
  const headers = {};
  const saved = dbSave.get('save').find({ source_url: DOMAIN + urlDetail }).value();
  if (saved !== null && saved !== undefined) {
    console.log(`${urlDetail} exist in db.json`)
    return saved;
  }
  const response = await sentHttp(`${urlDetail}?t=${Math.random()}`, { headers });
  if (response === []) {
    return [];
  }
  const $ = cheerio.load(response);
  const str = $('script:not([src])[type="text/javascript"]').eq(13).html();
  const regex = '});\n\n';
  if (str === null || str === undefined || typeof str !== 'string' || str.includes(regex) !== true) {
    return [];
  }
  const a = str.split(regex);
  // eslint-disable-next-line no-eval
  eval(a[1]);
  // eslint-disable-next-line no-undef
  const apiData = initData;
  // if (apiData.Properties.is)
  const facilities = apiData.Properties.map((item) => ({ name: item.Name, icon: item.Icon }));
  const facilityName = apiData.Properties.map((element) => element.Name).toString();
  const data = {
    country_name: COUNTRY,
    lang_code: LANG_CODE,
    weight: WEIGHT,
    status: STATUS,
    facility_name: facilityName,
    facilities,
    region_name: apiData.City,
    open_hours: await getOpenHour(apiData.RestaurantID),
    uuid: md5(apiData.RestaurantUrl),
    source_url: `${DOMAIN_FULL}${apiData.RestaurantUrl}`,
    name: apiData.Name,
    lat: apiData.Latitude,
    long: apiData.Longtitude,
    locality: apiData.District,
    tel: apiData.Phone,
    tels: await getTels(apiData.RestaurantID),
    website: apiData.Website,
    street: apiData.Address,
    short_description: apiData.MetaDescription,
    address: apiData.Address.concat(', ', apiData.District, ', ', apiData.City),
    content_type: type,
    raw_resource: apiData,
    logo_url: apiData.PictureModel.FullSizeImageUrl,
    banner_url: apiData.PictureModel.FullSizeImageUrl,
    thumbnail_urls: await getThumbnailUrls(apiData.RestaurantUrl),
    category_lv1_name,
    category_lv2_name,
    price: {
      from: parseFloat(apiData.PriceMin),
      to: parseFloat(apiData.PriceMax),
    },
  };
  return data;
};

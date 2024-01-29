require('dotenv').config();
const csv = require('csv-parser');
const fs = require('fs');
const md5 = require('md5');
const axios = require('axios');
const {
  COUNTRY, LANG_CODE, STATUS, WEIGHT,
} = require('./define');

require('dotenv').config();

const sync = async (result) => {
  let res = null;
  try {
    res = await axios.post(process.env.SYNC_URL, result);
    if (res.data.code !== 'SUCCESS') {
      res = await axios.post(process.env.SYNC_URL, result);
    }
    console.log(res.data);
  } catch (error) {
    if (error.response) {
      console.log(error.response);
      console.log(`try catch SYNC error status: ${error.response.status}`);
    }
  }
  return res;
};
async function syncAgoda(data) {
  const res = null;
  if (data.countryisocode === 'VN') {
    const result = {
      country_name: COUNTRY,
      lang_code: LANG_CODE,
      weight: WEIGHT,
      status: STATUS,
      facility_name: null,
      facilities: null,
      region_name: data.city,
      star_rating: data.star_rating,
      open_hour_name: `Giờ mở cửa: ${data.checkin}, giờ đóng cửa: ${data.checkout}`,
      uuid: md5(data.hotel_name),
      source_url: data.url,
      name: data.hotel_name,
      lat: data.latitude,
      long: data.longitude,
      locality: null,
      tel: null,
      raw_resource: data,
      tels: null,
      website: null,
      street: data.addressline1,
      short_description: data.overview,
      address: data.addressline1,
      content_type: 'hotels',
      logo_url: data.photo1,
      banner_url: data.photo1,
      thumbnail_urls: [data.photo1, data.photo2, data.photo3, data.photo4, data.photo5],
      // eslint-disable-next-line radix
      category_lv1_name: `${parseInt(data.star_rating)} sao`,
      price: {
        from: null,
        to: null,
      },
    };
    sync(result);
  }
  return res;
}

fs.createReadStream(process.env.CSV)
  .pipe(csv({
    mapHeaders: ({ header }) => header.trim(),
  }))
  .on('data', (data) => syncAgoda(data));
console.log('end');

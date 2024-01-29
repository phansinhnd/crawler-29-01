const cheerio = require('cheerio');
const { sentHttp } = require('./sentHttp');

exports.getTels = async function getTels(resId) {
  const url = `__get/Restaurant/RestaurantPhone?resId=${resId}`;
  const headers = {
    Connection: 'keep-alive',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en,vi;q=0.9',
  };
  const response = await sentHttp(url, { headers });
  const tels = [];
  if (response.length > 0) {
    const $ = cheerio.load(response);
    $('.res-phone-only').each(function () {
      tels.push($(this).text());
    });
  }
  return tels;
};

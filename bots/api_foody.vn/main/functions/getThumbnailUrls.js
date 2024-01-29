const cheerio = require('cheerio');
const { sentHttp } = require('./sentHttp');

exports.getThumbnailUrls = async function getThumbnailUrls(urlDetail) {
  const headers = {
    Connection: 'keep-alive',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en,vi;q=0.9',
  };
  const albumProRes = await sentHttp(`${urlDetail}/album-professional`, { headers });
  const albumKGRes = await sentHttp(`${urlDetail}/album-khong-gian`, { headers });
  const albumImgRes = await sentHttp(`${urlDetail}/album-anh`, { headers });
  const thumbs = [];
  [albumProRes, albumKGRes, albumImgRes].forEach((response) => {
    if (thumbs.length <= 0) {
      if (response) {
        const $ = cheerio.load(response);
        $('.thumb-image img').each(function () {
          thumbs.push($(this).attr('data-original'));
        });
      }
    }
  });
  return thumbs;
};

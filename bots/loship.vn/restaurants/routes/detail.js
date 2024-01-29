const Apify = require('apify');

const md5 = require('md5');
const logger = require('../logger');
const { NAME } = require('../configs/config');

module.exports = async ({ $, request, page }) => {
  // eslint-disable-next-line no-eval
  // eslint-disable-next-line no-undef
  const resortDataset = await Apify.openDataset(NAME);
  const title = await page.title();
  logger.info(`DETAIL_PAGE: ${request.url}: ${title}`);

  const data = await page.evaluate(() => {
    const images = [];
    $('#mc-header-photo .img-lazy .img').each(function () {
      images.push($(this).attr('data-src'));
    });
    const categories = [];
    $('.categories .category').each(function () {
      categories.push($(this).text());
    });
    return {
      name: $('h1[itemprop="name"]').text(),
      address: $('.d-container .row .col:eq(0) .col-item:eq(1)').text(),
      category_name: categories.toString(),
      images,
    };
  });

  // eslint-disable-next-line no-console
  console.log(request.url);

  await resortDataset.pushData({
    ...data,
    ...request.userData,
    source_url: request.url,
    content_type: 'hotels',
    uuid: md5(request.url),
    lang_code: 'vi',
    weight: 999,
    status: 2,
  });
};

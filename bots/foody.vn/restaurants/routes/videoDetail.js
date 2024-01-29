const Apify = require('apify');

const {
  utils: { sleep },
} = Apify;
const logger = require('../logger');
const { NAME } = require('../configs/config');

module.exports = async ({ $, request, page }) => {
  await sleep(2000);
  await page.click('.detail-video > a');
  await sleep(2000);

  const restaurantVideoDetailDataset = await Apify.openDataset(`${NAME}-video`);

  const title = await page.title();
  logger.info(`VIDEO_DETAIL_PAGE: ${request.url}: ${title}`);

  page.on('console', (consoleObj) => console.log(consoleObj.text()));

  const data = await page.evaluate(() => {
    console.log($('#embed-video_html5_api').length, $('#embed-video_html5_api').attr('src'));
    return {
      video: $('#embed-video_html5_api').attr('src'),
    };
  }, request);

  logger.info(data);

  await restaurantVideoDetailDataset.pushData({
    ...data,
    ...request.userData,
    source_video_url: request.url,
    // content_type: 'restaurant_videos',
  });
};

const Apify = require('apify');

const {
  utils: { sleep },
} = Apify;

const logger = require('../logger');
const enqueueDetailLinks = require('../actions/enqueueDetailLinks');

module.exports = async ({ $, request, page }, { requestQueue }) => {
  const title = await page.title();
  logger.info(`LIST_PAGE: ${request.url}: ${title}`);

  logger.info('WAIT_LOAD_ITEM');
  await page.waitFor('.filter-result-item', { timeout: 30000 });

  let counter = await page.evaluate(() => $('.filter-result-item').length);

  await Apify.utils.puppeteer.infiniteScroll(page, {
    timeoutSecs: 4,
    waitForSecs: 60,
  });

  logger.info('SCROLL_TO_LOAD');
  while (counter > 0) {
    logger.info('SCROLL_LOOP:', { counter });

    const tmp = counter;

    // eslint-disable-next-line no-await-in-loop
    await Apify.utils.puppeteer.infiniteScroll(page, {
      timeoutSecs: 4,
      waitForSecs: 60,
    });

    // eslint-disable-next-line no-await-in-loop
    counter = await page.evaluate(() => $('.filter-result-item').length);

    if (counter <= tmp) {
      logger.info('SCROLL_FINISH: BREAK', { counter });
      break;
    }
  }

  logger.info('CLICK_TO_LOAD');
  while (true) {
    logger.info('CLICK_LOOP:', { counter });

    try {
      logger.info('CLICK_MORE:', { counter });

      // eslint-disable-next-line no-await-in-loop
      await page.click('a[rel="next"]');
      // eslint-disable-next-line no-await-in-loop
      await sleep(3000);
    } catch (e) {
      logger.info(`NO_MORE: BREAK CLICK_LOOP ${counter}, ERROR: ${e}`);
      break;
    }
    const counterOld = counter;
    // eslint-disable-next-line no-await-in-loop
    counter = await page.evaluate(() => $('.filter-result-item').length);

    if (counter === counterOld) {
      logger.info('CLICK_MORE_FINISH: BREAK', { counter });
      break;
    }
  }

  await enqueueDetailLinks({
    page,
    requestQueue,
    userData: request.userData,
  });
};

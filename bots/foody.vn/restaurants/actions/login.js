const { EMAIL, PASSWORD } = require('../configs/account');
const logger = require('../logger');

const login = async (page) => {
  const isLoggedIn = await page.evaluate(() => $('#account').length);

  if (isLoggedIn <= 0) {
    try {
      logger.info('CLICK_LOGIN');

      await page.click('.fd-btn-login-new');
    } catch (e) {
      logger.error('LOGIN_EXCEPTION: ', { e });
    }

    await page.waitForNavigation();

    try {
      logger.info('CLICK_SUBMIT_LOGIN');

      await page.type('#Email', EMAIL);
      await page.type('#Password', PASSWORD);
      await page.click('#bt_submit');
    } catch (e) {
      logger.error('SUBMIT_LOGIN_EXCEPTION: ', e);
    }

    await page.waitForNavigation();

    logger.info('LOGIN_SUCCESS');
  }
};

module.exports = login;

const Apify = require('apify');
const {
  utils: { sleep },
} = Apify;

const md5 = require('md5');
const logger = require('../logger');
const { NAME } = require('../configs/config');
const { getDataFromMongoDB, getRegionId } = require('../functions/handleRegions');
const downloadImage = require('../functions/downloadImage');
// const getOpenHours = require('/bots/common/getOpenHours');
const getOpenHours = require('../functions/getOpenHours');
const getDescription = require('../functions/getDescription');
const getFacilities = require('../functions/getFacilities');
const { v4: uuidv4 } = require('uuid');
module.exports = async ({ $, request, page }) => {
  const restaurantDataset = await Apify.openDataset(NAME);
  let region;

  const title = await page.title();
  logger.info(`DETAIL_PAGE: ${request.url}: ${title}`);

  await sleep(3000);


  // mo popup gio mo cua
  const showOpenTime = await page.evaluate(() => $('.mMkhr').length);
  if (showOpenTime) {
    logger.info('CLICK_SHOW_OPEN_TIME');

    await page.click('.mMkhr');
  }

  const hours = await getOpenHours($, page);

  // mo popup mo ta chi tiet
  const description = await page.$x("//a[contains(text(), 'Xem tất cả chi tiết')]");
  if (description.length > 0) {
    logger.info('CLICK_DESCRIPTION');
    await description[0].click();
  }

  const shortDescription = await page.evaluate(() => {
    if ($('.jmnaM').length > 0) {
      return $('.jmnaM').text();
    }
    else { return '' };
  });

  // const facilities_name = await page.evaluate(() => $(".tbUiL.b:contains('ĐẶC TRƯNG')").next('div.SrqKb').html().split(', '));
  const facilities_name = await page.evaluate(() => {
    if ($(".tbUiL.b:contains('ĐẶC TRƯNG')").next('div.SrqKb').length) {
      return $(".tbUiL.b:contains('ĐẶC TRƯNG')").next('div.SrqKb').html().split(', ');
    }
    else {
      return '';
    }
  });
  const descriptionNew = await getDescription($, page);
  const facilities = await getFacilities(facilities_name);
  // const descriptionNew = await getDescription($, page);

  // dong popup mo ta chi tiet
  logger.info('CLICK_CLOSE_DESCRIPTION');
  await page.click('.zPIck._Q.Z1.t._U.c._S.zXWgK');

  await sleep(1000);

  // mo popup album anh
  const albums = await page.$x("//span[@class='see_all_count']//span[contains(text(),'Xem tất cả')]");
  if (albums.length > 1) {
    logger.info('CLICK_SHOW_ALBUM');
    await albums[1].click();
  } else {
    logger.info('CLICK_SHOW_ALBUM');
    await albums[0].click();
  }

  await sleep(3000);

  // const counter = await page.evaluate(() => $('.photoGridBox .photoGridImg').length);
  // logger.info('SCROLL_TO_LOAD_ALBUM');
  // while (counter < 25) {
  //   logger.info('SCROLL_LOOP:', { counter });

  //   // eslint-disable-next-line no-await-in-loop
  //   await Apify.utils.puppeteer.infiniteScroll(page, {
  //     timeoutSecs: 4,
  //     waitForSecs: 60,
  //   });

  //   if (counter >= 25) {
  //     logger.info('SCROLL_FINISH: BREAK', { counter });
  //     break;
  //   }
  // }

  // let nodeCounter = 0;

  // logger.info('SCROLL_TO_LOAD_ALBUM');
  // while (nodeCounter < 25) {
  //   // eslint-disable-next-line no-await-in-loop
  //   await Apify.utils.puppeteer.infiniteScroll(page, {
  //     timeoutSecs: 4,
  //     waitForSecs: 60,
  //   });

  //   // Lấy giá trị của counter từ trình duyệt
  //   const browserCounter = await page.evaluate(() => $('.photoGridBox .photoGridImg').length);

  //   logger.info('SCROLL_LOOP:', { counter: browserCounter });

  //   // Gán giá trị từ trình duyệt cho biến nằm trong môi trường Node.js
  //   nodeCounter = browserCounter;

  //   if (nodeCounter >= 25) {
  //     logger.info('SCROLL_FINISH: BREAK', { counter: nodeCounter });
  //     break;
  //   }
  // }

  let nodeCounter = 0;

  while (nodeCounter < 21) {
    const browserCounterBefore = await page.evaluate(() => $('.photoGridBox .photoGridImg').length);

    // eslint-disable-next-line no-await-in-loop
    await Apify.utils.puppeteer.infiniteScroll(page, {
      timeoutSecs: 2,
      waitForSecs: 30,
    });

    // Lấy giá trị mới từ trình duyệt
    const browserCounter = await page.evaluate(() => $('.photoGridBox .photoGridImg').length);

    logger.info('SCROLL_LOOP:', { counter: browserCounter, url: page.url() });

    // Kiểm tra xem giá trị đã thay đổi hay chưa
    if (browserCounter !== nodeCounter) {
      // Nếu giá trị đã thay đổi, cập nhật giá trị của nodeCounter và tiếp tục vòng lặp
      nodeCounter = browserCounter;
    } else {
      // Nếu giá trị không thay đổi, tạm dừng vòng lặp để tránh lặp vô hạn
      await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 2 giây
    }

    // Lấy giá trị mới từ trình duyệt sau cuộn
    const browserCounterAfter = await page.evaluate(() => $('.photoGridBox .photoGridImg').length);

    // Kiểm tra sự thay đổi trước và sau cuộn
    if (browserCounterBefore === browserCounterAfter) {
      logger.info('SCROLL_FINISH: BREAK', { counter: browserCounterAfter });
      break;
    }

    if (nodeCounter >= 20) {
      logger.info('SCROLL_FINISH: BREAK', { counter: nodeCounter });
      break;
    }
  }




  const data = await page.evaluate(() => {
    const locationUri = $('div.kDZhm span a').attr('href');
    const location = locationUri.split('@').pop().split(',');
    const galleries = [];
    let galleries_output;
    $('.photoGridBox .photoGridImg .fillSquare img').each(function () {
      galleries.push($(this).attr('src'));
    });
    galleries_output = galleries.filter(src => src !== null && src !== undefined).slice(0, 20);
    // let galleries_handle =  galleries[0];
    return {
      loc: {
        type: 'Point',
        coordinates: [parseFloat(location[1]).toFixed(8), parseFloat(location[0]).toFixed(8)],
      },
      name: $('.HjBfq').text(),
      address: $('div.vQlTa span.DsyBj span a[href="#MAPVIEW"]').text().split(' ').slice(0, -3)
        .join(' '),
      region_name: $('.breadcrumb:eq(2) a').text(),
      logo_url: $('.large_photo_wrapper img.basicImg').attr('src'),
      banner_url: galleries.length >= 2 ? galleries[1] : '',
      thumbnail_urls: galleries_output,
      tel: $('span.AYHFM:first a').length > 0 ? $('span.AYHFM:first a').text().replace(/ /g, '') : '',
      website: $("a:contains('Trang web')").length > 0 ? $("a:contains('Trang web')").attr('href') : '',
      email: $('.IdiaP.sNsFa:eq(1) a').length > 0 ? $('.IdiaP.sNsFa:eq(1) a').attr('href').replace('mailto:', '').split('?')[0] : '',
    };
  });
  // Lấy id của region
  const dataRegion = await getDataFromMongoDB();

  const region_name = data.region_name;
  region = getRegionId(region_name, dataRegion);
  // logo_url = data.logo_url ;
  // Lấy id của banner img
  const logoImgId = await downloadImage(data.logo_url);
  //Lấy  mảng id thmubnail img
  const thumbnailIds = [];
  const thumbnailurls = data.thumbnail_urls;

  for (const [index, url] of thumbnailurls.entries()) {
    try {
      if (url === region_name) {
        thumbnailIds.push(logoImgId);
        continue;
      }
      const thumbnailId = await downloadImage(url);
      thumbnailIds.push(thumbnailId);
      console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Image ${index + 1} downloaded successfully: ${url}`);
    } catch (error) {
      console.error(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Error downloading image ${index + 1} from ${url}: ${error.message}`);
    }
  }

  let files = {
    logo: [logoImgId],
    banner: [thumbnailIds[1] ?? []],
    thumbnails: thumbnailIds,
  }
  // const regionData = await getDataFromMongoDB();

  await restaurantDataset.pushData({
    loc: data.loc,
    name: data.name,
    address: data.address,
    region_name: data.region_name,
    region: region,
    hours,
    files,
    short_description: shortDescription,
    facility_names: facilities_name,
    facilities,
    description: descriptionNew,
    tel: data.tel,
    website: data.website,
    email: data.email,
    ...request.userData,
    source_url: request.url,
    content_type: 'restaurants',
    type: 'Restaurant',
    uuid: md5(request.url),
    country_code: 'VN',
    lang_code: 'vi',
    weight: 999,
    status: 2,
  });
};

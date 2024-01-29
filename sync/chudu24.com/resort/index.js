const Apify = require('apify');
// eslint-disable-next-line no-unused-vars
const p = require('phin');
// eslint-disable-next-line import/no-extraneous-dependencies
const { ObjectId } = require('mongodb');
require('dotenv').config();

const {
  utils: { sleep },
} = Apify;

const { SYNC_URL } = process.env;
const { SYNC_IMAGE } = process.env;
const { SYNC_FACILITY } = process.env;
const { SYNC_REGION } = process.env;

const sync = async (datasetName) => {
  const dataset = await Apify.openDataset(datasetName);
  const { items } = await dataset.getData();
  const results = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const item of items) {
    item.files = {
      logo: [],
      banner: [],
      thumbnails: [],
    };
    item.fileUris = {
      logo: {},
      banner: {},
      thumbnails: {},
    };
    item.facilities = [];
    item.openHours = {};

    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < 8; i++) {
      item.openHours[i.toString()] = {};
      item.openHours[i.toString()].start = {};
      item.openHours[i.toString()].end = {};
      item.openHours[i.toString()].start['1'] = 0;
      item.openHours[i.toString()].end['1'] = 1439;
    }

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= item.facility_names.length; i++) {
      if (typeof item.facility_names[i] !== 'undefined') {
        // eslint-disable-next-line no-unused-vars,no-await-in-loop
        const res = await p({
          url: SYNC_FACILITY,
          method: 'POST',
          parse: 'json',
          data: { name: item.facility_names[i] },
        });
        item.facilities.push(res.body.data);
      }
    }

    if (typeof item.logo_url !== 'undefined') {
      // eslint-disable-next-line no-unused-vars,no-await-in-loop
      const logo = await p({
        url: SYNC_IMAGE,
        method: 'POST',
        parse: 'json',
        data: { url: item.logo_url },
      });
      item.files.logo.push(new ObjectId(logo.body.data.id));
      item.fileUris.logo[logo.body.data.id] = logo.body.data.uri;
    }

    if (typeof item.banner_url !== 'undefined') {
      // eslint-disable-next-line no-await-in-loop
      const banner = await p({
        url: SYNC_IMAGE,
        method: 'POST',
        parse: 'json',
        data: { url: item.banner_url },
      });
      item.files.banner.push(new ObjectId(banner.body.data.id));
      item.fileUris.banner[banner.body.data.id] = banner.body.data.uri;
    }

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 20; i++) {
      if (typeof item.thumbnail_urls[i] !== 'undefined') {
        // eslint-disable-next-line no-await-in-loop
        await sleep(1000);
        // eslint-disable-next-line no-unused-vars,no-await-in-loop
        const thumbnails = await p({
          url: SYNC_IMAGE,
          method: 'POST',
          parse: 'json',
          data: { url: item.thumbnail_urls[i] },
        });
        item.files.thumbnails.push(new ObjectId(thumbnails.body.data.id));
        item.fileUris.thumbnails[thumbnails.body.data.id] = thumbnails.body.data.uri;
      }
    }

    if (typeof item.region_name !== 'undefined') {
      // eslint-disable-next-line no-await-in-loop
      const resRegion = await p({
        url: SYNC_REGION,
        method: 'POST',
        parse: 'json',
        data: { name: item.region_name },
      });
      item.region = resRegion.body.data;
    }

    // eslint-disable-next-line no-await-in-loop,no-unused-vars
    const res = await p({
      url: SYNC_URL,
      method: 'POST',
      parse: 'json',
      data: item,
    });
    results.push(res.body);
  }
  return results;
};

Apify.main(async () => {
  const hotelResult = await sync('chudu24.com-resort');
  console.log(hotelResult);
});

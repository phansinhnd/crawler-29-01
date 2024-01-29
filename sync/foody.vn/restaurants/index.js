const Apify = require('apify');
const p = require('phin');
require('dotenv').config();

const { SYNC_URL } = process.env;

const sync = async (datasetName) => {
  const dataset = await Apify.openDataset(datasetName);
  const { items } = await dataset.getData();
  const results = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const item of items) {
    // eslint-disable-next-line no-await-in-loop
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
  const restaurantResult = await sync('foody.vn-restaurants');
  console.log(restaurantResult);

  const galleryResult = await sync('foody.vn-restaurants-gallery');
  console.log(galleryResult);
});

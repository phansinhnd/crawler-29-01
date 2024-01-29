const Apify = require('apify');
const p = require('phin');
require('dotenv').config();

const { SYNC_URL } = process.env;

const sync = async (datasetName) => {
  const dataset = await Apify.openDataset(datasetName);
  const { items } = await dataset.getData();
  console.log(items)
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
  const restaurantResult = await sync('ticketbox.vn-events_festivals');
  console.log(restaurantResult);
});

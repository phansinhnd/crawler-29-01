const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { crawlerListPage } = require('./crawlerListPage');
require('dotenv').config();

const dbRaw = low(new FileSync('db_raw.json'));
exports.runListPage = async function runListPage() {
  // eslint-disable-next-line no-restricted-syntax
  for (const cateRaw of dbRaw.get('raw').value()) {
    // eslint-disable-next-line no-await-in-loop
    await crawlerListPage(cateRaw);
  }
};

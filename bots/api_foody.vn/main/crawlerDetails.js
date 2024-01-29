const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { crawlerListPage } = require('./functions/crawlerListPage');

const dbSave = low(new FileSync('db_save.json'));
const dbRaw = low(new FileSync('db_raw.json'));

dbSave.defaults({
  save: [],
}).write();

exports.crawlerDetails = async function crawlerDetails() {
  console.log('Lấy link detail dựa vào list link cate - city');
  // Lấy list data dựa vào list link detail
  // eslint-disable-next-line no-restricted-syntax
  for (const cateRaw of dbRaw.get('raw').value().reverse()) {
    // eslint-disable-next-line no-await-in-loop
    await crawlerListPage(cateRaw);
  }

  // dbRaw.get('raw').value().reverse().map(async (cateRaw) => {
  //   // eslint-disable-next-line no-await-in-loop
  //   await crawlerListPage(cateRaw);
  // });
};

const low = require('lowdb');
const _ = require('lodash');
const FileSync = require('lowdb/adapters/FileSync');
const { syncData } = require('./syncData');
const { DOMAIN } = require('../define');
const { crawlerPage } = require('./crawlerPage');

const dbSave = low(new FileSync('db_save.json'));
dbSave.defaults({
  save: [],
}).write();

exports.crawlerListPage = async function crawlerListPage(cate) {
  const listUri = cate.uris;
  const chunks = _.chunk(listUri.flat(), 30);
  for (const uris of chunks) {
    await Promise.all(uris.map(async (uri) => {
      const pageData = await crawlerPage(
        uri,
        cate.category_lv1_name,
        cate.category_lv2_name,
        cate.type,
      );
      const saved = dbSave.get('save').find({ source_url: DOMAIN + uri }).value();
      if (saved === null || saved === undefined) {
        console.log(`push: ${pageData.name}`);
        // await syncData(pageData);
        dbSave.get('save').push(pageData).write();
      }
    }));
  }
};

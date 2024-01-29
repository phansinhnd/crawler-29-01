const low = require('lowdb');
const _ = require('lodash');
const FileSync = require('lowdb/adapters/FileSync');
const { syncData } = require('./functions/syncData');
require('dotenv').config();

const dbSave = low(new FileSync('db_save.json'));

dbSave.defaults({
  save: [],
}).write();

exports.syncAll = async function syncAll() {
  // eslint-disable-next-line no-restricted-syntax
  // for (const data of dbSave.get('save').value()) {
  //   // eslint-disable-next-line no-await-in-loop
  //   await syncData(data);
  // }
  const chunks = _.chunk(dbSave.get('save').value(), 60);
  for (const chunk of chunks) {
    await Promise.all(chunk.map(async (data) => {
      // eslint-disable-next-line no-await-in-loop
      await syncData(data);
    }));
  }
};

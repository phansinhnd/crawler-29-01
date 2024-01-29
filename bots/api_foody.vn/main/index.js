const { getLinkDetails } = require('./getLinkDetails');
const { crawlerDetails } = require('./crawlerDetails');
const { syncAll } = require('./syncAll');

async function main() {
  // await getLinkDetails();
  await crawlerDetails();
  await syncAll();
}
main();

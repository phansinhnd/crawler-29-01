
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { sentHttp } = require('./sentHttp');
require('dotenv').config();

const dbRaw = low(new FileSync('db_raw.json'));
dbRaw.defaults({
  raw: [],
}).write();

const { COOKIE } = process.env;

exports.crawlerItemCate = async function crawlerItemCate(cate) {
  const cateRaw = dbRaw.get('raw').find({ url: cate.url, name: cate.name }).value();
  if (cateRaw !== undefined && cateRaw.uris !== undefined && cateRaw.uris.length > 0) {
    return;
  }
  const headers = {
    Connection: 'keep-alive',
    Cookie: COOKIE,
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en,vi;q=0.9',
  };
  // truyền thêm param với các danh mục có format https://www.foody.vn/ha-noi/food/dia-diem?q=trà+sữa
  const url = `${cate.url}`;
  const response = await sentHttp(url, {
    headers,
    data: { ...cate.param },
  });
  console.log(response);
  if (response === [] || typeof response !== 'object') {
    return [];
  }
  const totalResult = 'totalResult' in response ? response.totalResult : 0;
  const totalPage = Math.ceil(totalResult / 12) + 1;
  const arrPage = Array.from(Array(totalPage).keys());
  if (!Array.isArray(arrPage) || !arrPage.length > 0) {
    return [];
  }
  const uris = [];
  for (const page of arrPage) {
    const data = { ...cate.param, page: page + 1 };
    const res = await sentHttp(url, { headers, data });
    const list = res.searchItems !== undefined && res.searchItems.length > 0 ? res.searchItems : [];
    uris.push(list.map((item) => item.DetailUrl));
  }
  const result = { ...cate, uris: uris.flat(1) };
  dbRaw.get('raw').push(result).write();
};

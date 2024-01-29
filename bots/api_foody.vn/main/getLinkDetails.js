const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const _ = require('lodash');
const { getCity } = require('./functions/getCity');
const { getCate } = require('./functions/getCate');
const { crawlerItemCate } = require('./functions/crawlerItemCate');

const db = low(new FileSync('db.json'));

db.defaults({
  cities: [], city_category: [],
}).write();

const getLinkDetails = async () => {
  const cities = await getCity();
  db.set('cities', cities).write();
  // Lấy list cate
  const cates = await getCate();
  let cateDataByCity = [];
  // Lấy list map city_category
  console.log('Lấy list map city_category');
  if (_.isEmpty(db.get('city_category').value())) {
    cateDataByCity = await Promise.all(cities.map(async (city) => {
      const cityCate = await Promise.all(cates.map(async (cate) => ({
        url: `${city.url}/${cate.uri}`,
        param: cate.param,
        name: cate.name,
        category_lv1_name: cate.category_lv1_name,
        category_lv2_name: cate.category_lv2_name,
        type: cate.type,
      })));
      return cityCate;
    }));
    console.log(1);
    console.log(cateDataByCity);
    db.set('city_category', cateDataByCity.flat(2)).write();
  }
  console.log('Lấy link detail dựa vào list link cate - city');
  // eslint-disable-next-line no-restricted-syntax
  for (const cate of db.get('city_category').value()) {
    // eslint-disable-next-line no-await-in-loop
    await crawlerItemCate(cate);
  }
};

exports.getLinkDetails = getLinkDetails;

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { sentHttp } = require('./sentHttp');

const adapter = new FileSync('db.json');
const db = low(adapter);

exports.getCity = async function getCity() {
  if (db.get('cities').value() && db.get('cities').value().length > 0) {
    return db.get('cities').value();
  }
  const headers = {};
  const url = '__get/Common/GetListCityInCountry';
  const response = await sentHttp(url, { headers });
  const cities = response.TopCities.map((item) => ({ name: item.Name, url: item.UrlRewriteName }));
  return cities;
};

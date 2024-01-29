const { sentHttp } = require('./sentHttp');

exports.getOpenHour = async function getOpenHour(resId) {
  const url = `__get/Restaurant/GetOpeningTime?resId=${resId}`;
  const headers = {
    Connection: 'keep-alive',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en,vi;q=0.9',
  };
  const openHours = {};
  const response = await sentHttp(url, {
    headers,
  });
  if (response === []) {
    return openHours;
  }
  const openHourRaw = response.Items;
  if (openHourRaw) {
    openHourRaw.forEach((obj) => {
      if (obj.Times !== undefined && obj.Times[0] !== undefined) {
        const objTime = obj.Times[0];
        const timeOpen = objTime.TimeOpen !== undefined ? objTime.TimeOpen : null;
        const timeClose = objTime.TimeClose !== undefined ? objTime.TimeClose : null;
        openHours[obj.DOW] = {
          start: timeOpen,
          end: timeClose,
        };
      }
    });
  }
  return openHours;
}

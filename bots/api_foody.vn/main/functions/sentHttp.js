const axios = require('axios');
const _ = require('lodash');

const { HEADER_DEFAULT, DOMAIN_FULL } = require('../define');
const { sleep } = require('./sleep');

const sentHttp = async (uri, options, retry = 3) => {
  const timeout = 30000;
  let headers = {};
  let data = {};
  let url = '';
  let queryString = '';
  if (!_.isEmpty(options.data)) {
    data = options.data;
    queryString = Object.keys(data).map((key) => `${key}=${data[key]}`).join('&');
  }
  url = uri.concat('?', queryString);
  if ((options.headers !== undefined && options.headers !== null)) {
    headers = Object.assign(options.headers, HEADER_DEFAULT);
  }
  const baseURL = DOMAIN_FULL;
  console.log(`url: ${url} retry count: ${3 - retry}`);
  try {
    const res = await axios.get(url, {
      headers, data, timeout, baseURL,
    });
    return res.data;
  } catch (error) {
    if (error.response) {
      console.log(`try catch error: ${url} status: ${error.response.status}`);
    }
    if (retry > 0) {
      await sleep(3000);
      return sentHttp(uri, options, retry - 1);
    }
  }
};

exports.sentHttp = sentHttp;

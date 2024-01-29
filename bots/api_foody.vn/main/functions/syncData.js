require('dotenv').config();
const axios = require('axios');

exports.syncData = async function syncData(data) {
  if (typeof data === 'object' && data !== []) {
    try {
      let res = await axios.post(process.env.SYNC_URL, data);
      if (res.data.code !== 'SUCCESS') {
        res = await axios.post(process.env.SYNC_URL, data);
      }
      console.log(res.data);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(`try catch SYNC error status: ${error.response.status}`);
      }
    }
  }
};

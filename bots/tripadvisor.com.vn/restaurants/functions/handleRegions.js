
const { MongoClient} = require('mongodb');
// const Apify = require('apify');
const dotenv = require('dotenv');
const { REGIONS_COLLECTION } = require('../configs/config');
const diacritics = require('diacritics');
dotenv.config();
const { MONGO_HOST, MONGO_PORT, MONGO_DB_NAME } = process.env;
const MONGO_CONNECTION_STRING = `mongodb://${MONGO_HOST}:${MONGO_PORT}`;
const client = new MongoClient(MONGO_CONNECTION_STRING, { useUnifiedTopology: true });

// Hàm lấy mảng id và name region
async function getDataFromMongoDB() {
    try {
        await client.connect();
        // const db = client.db(MONGO_DB_NAME);
        const database = client.db(MONGO_DB_NAME);
        const collection = database.collection(REGIONS_COLLECTION);
        const result = await collection.find({}, { projection: { _id: 1, name: 1 } }).toArray();
        return result;
    } finally {
        await client.close();
    }

};
// Hàm xử lý chuyển tên tỉnh thành không dấu, viết liền, chữ thường
// function handleRegions(data) {
//     let result = [];
//     for (item of data) {
//         let id = item._id;
//         // let name = diacritics.remove(item.name).toLowerCase().replace(/\s/g, '');
//         let name = item.name;
//         result.push({ id, name });
//     }
//     return result;
// }
// Hàm so sánh và lấy id của tỉnh thành
function getRegionId(nameFromPage, Regions) {
    // nameRegion = diacritics.remove(nameFromPage).toLowerCase().replace(/\s/g, '');
    if (nameFromPage === "saigon") {
        for (item of Regions) {
            if (item.name === 'hochiminh') {
                return item._id;
            }
        }
    }
    for (item of Regions) {
        if (item.name === nameFromPage) {
            return item._id;
        }
    }
    return '';
}

// getDataFromMongoDB()
//     .then((data) => {console.log(getRegionId('Hà Nội' ,data));})
//     .catch((error) => console.error(error));

// console.log(regions);



// exports.handleRegions = function handleRegions(region) {



//     return;
// };
// console.log(getDataFromMongoDB());

module.exports = {
    getDataFromMongoDB,
    getRegionId,
};
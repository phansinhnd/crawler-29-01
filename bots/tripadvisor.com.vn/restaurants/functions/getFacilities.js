
const { MongoClient, ObjectId } = require('mongodb');
// const Apify = require('apify');
const dotenv = require('dotenv');
const { FACILITIES_COLLECTION } = require('../configs/config');
const diacritics = require('diacritics');
const { result } = require('lodash');
dotenv.config();
const { MONGO_HOST, MONGO_PORT, MONGO_DB_NAME } = process.env;
const MONGO_CONNECTION_STRING = `mongodb://${MONGO_HOST}:${MONGO_PORT}`;
const client = new MongoClient(MONGO_CONNECTION_STRING, { useUnifiedTopology: true });

module.exports =  async function getDataFromMongoDB(arr) {
    try {
        await client.connect();
        // const db = client.db(MONGO_DB_NAME);
        const database = client.db(MONGO_DB_NAME);
        const collection = database.collection(FACILITIES_COLLECTION);
        const facilities = await collection.find({}, { projection: { _id: 1, name: 1 } }).toArray();
        let result = [];
        // console.log(facilities,arr);

        for (let facility of arr) {
            let isInsert = true;
            for (let item of facilities) {
                if (facility === item.name) {
                    result.push(item._id);
                    isInsert = false;
                    break;
                }
            }
            if (isInsert) {
                const newData ={
                    name: facility,
                    created: new Date(),
                }
               const dataInsert =  await collection.insertOne(newData);
                // console.log('chèn:', newData, dataInsert.insertedId);
                result.push(dataInsert.insertedId)
            }
        }
        console.log('Kết nối thành công');
        return result;
    } finally {
        await client.close();
    }
};

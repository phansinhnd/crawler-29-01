const { MongoClient, ObjectId } = require('mongodb');
const Apify = require('apify');
const dotenv = require('dotenv');
const diacritics = require('diacritics');

dotenv.config();
const { MONGO_HOST, MONGO_PORT, MONGO_DB_NAME } = process.env;
const MONGO_CONNECTION_STRING = `mongodb://${MONGO_HOST}:${MONGO_PORT}`;

const client = new MongoClient(MONGO_CONNECTION_STRING, { useUnifiedTopology: true });

const syncToMongoDB = async (datasetName) => {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB successfully!');
    await client.connect();
    const COLLECTION_NAME = 'restaurants_crawler'; // Đặt tên của collection bạn muốn lưu vào MongoDB
    const db = client.db(MONGO_DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    // Nếu collection chưa tồn tại, tạo mới
    if (!(await db.listCollections({ name: COLLECTION_NAME }).hasNext())) {
        await db.createCollection(COLLECTION_NAME);
    }
    const dataset = await Apify.openDataset(datasetName);
    const { items } = await dataset.getData();

    const results = [];

    for (const item of items) {
       const files = {
            banner: [new ObjectId()],
            logo: [new ObjectId()],
            thumbnails: [new ObjectId()]
        },
        // Bạn có thể tùy chỉnh dữ liệu ở đây để phản ánh cấu trúc MongoDB mong muốn
        obj = {
            loc: item.loc,
            name: item.name,
            name_ascii: diacritics.remove(item.name),
            address: item.address,
            region: item.region,
            region_name: item.region_name,
            tel: item.tel,
            website: item.website  ,
            email: item.email,
            short_description: item.short_description,
            description: item.description,
            description_ascii: item.short_description ? diacritics.remove(item.short_description) :"",
            facility_names: item.facility_names,
            facilities: item.facilities,
            content_type: item.content_type,
            hours: item.hours,
            type: item.type,
            uuid: item.uuid,
            country_code: item.country_code,
            lang_code: item.lang_code,
            weight: item.weight,
            status: item.status,
            files,
            file_uris: {
                banner: {
                    [(files.banner)[0]]: item.banner_url
                },
                logo: {
                    [(files.logo)[0]]:item.logo_url
                },
                thumbnails: {
                    [(files.thumbnails)[0]]: item.thumbnail_urls
                }
            },
            created: new Date(),
           
        };
        try {
            const result = await collection.insertOne(obj);

            if (result.ops && result.ops.length > 0) {
                results.push(result.ops[0]); // ops[0] chứa dữ liệu đã được chèn
            } else {
                console.error('Chèn dữ liệu không thành công:', item);
            }
        } catch (error) {
            console.error('Lỗi khi chèn dữ liệu:', error);
        }
    }

    // return results;
};

Apify.main(async () => {
    try {
        // const resResult = 
        await syncToMongoDB('tripadvisor.com.vn-restaurants');
        // console.log(resResult);
    } finally {
        // Đảm bảo đóng kết nối sau khi kết thúc
        await client.close();
    }
});



const axios = require('axios');
const fs = require('fs');
const path = require('path');

const { MongoClient, ObjectId } = require('mongodb');
// const Apify = require('apify');
const dotenv = require('dotenv');
const { FILES_COLLECTION } = require('../configs/config');
dotenv.config();
const { MONGO_HOST, MONGO_PORT, MONGO_DB_NAME } = process.env;
const MONGO_CONNECTION_STRING = `mongodb://${MONGO_HOST}:${MONGO_PORT}`;
const client = new MongoClient(MONGO_CONNECTION_STRING, { useUnifiedTopology: true });




async function saveFileInfoToDB(imgName, contentLength, folderPath) {
    try {
        await client.connect();
        // const db = client.db(MONGO_DB_NAME);
        const database = client.db(MONGO_DB_NAME);
        const collection = database.collection(FILES_COLLECTION);

        // let result = [];
        // console.log(facilities,arr);
        const imgType = imgName.match(/\.([^./]+)$/)[1];
        const newData = {
            name: imgName,
            size: contentLength,
            mime: `image/${imgType}`,
            status: 1,
            uri: `${folderPath}/${imgName}`,
            created: new Date(),
        }

        const dataInsert = await collection.insertOne(newData);
        console.log('chèn:', newData, dataInsert.insertedId);
        return dataInsert.insertedId;

    } catch (error) {
        console.error('Lỗi khi lưu thông tin vào cơ sở dữ liệu:', error.message);

    } finally {
        await client.close();
        console.log('Lưu thành công và đóng kết nối.');
    }
};



// Ham tao chuoi random trong ten anh
function generateRandomString(length) {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

// Ham create ten anh
function createImageName(url) {
    try {
        const match = url.match(/\/([^\/]+)$/);
        let mainName;
        // Kiểm tra xem có kết quả hay không
        if (match && match[1]) {
            mainName = match[1];
            console.log('Nội dung từ dấu / cuối cùng đến hết chuỗi là:', mainName);
        } else {
            console.error('Không thể lấy nội dung từ dấu / cuối cùng đến hết chuỗi.');
        }
        const randomNamePart = Date.now() + '-' + generateRandomString(10);
        return randomNamePart + '-' + mainName;
    } catch (error) {
        console.error('Lỗi:', error.message);
        return null;
    }

}

module.exports =
    async (url) => {
        try {

            const response = await axios({
                method: 'get',
                url: url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                responseType: 'stream',
            });

            const currentDatetime = new Date();
            const year = currentDatetime.getFullYear();
            const month = (currentDatetime.getMonth() + 1).toString().padStart(2, '0');// Thêm '0' phía trước nếu tháng chỉ có một chữ số
            const day = currentDatetime.getDate().toString().padStart(2, '0'); //Thêm '0' phía trước nếu ngày chỉ có một chữ số
            const folderPath = `datas/post_files_crawler/${year}/${month}/${day}/image`;
            const destinationPath = path.resolve(__dirname, '..') + `/${folderPath}`;

            if (!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath, { recursive: true });
            }
            const imgName = createImageName(url);
            const contentLength = response.headers['content-length'];
            const fullImagePath = path.join(destinationPath, '/' + imgName);
            const writer = fs.createWriteStream(fullImagePath);
            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', async() => {
                    // Thêm thời gian chờ ở đây trước khi gọi resolve
                    setTimeout(async() => {
                        const result =  await saveFileInfoToDB(imgName, contentLength, folderPath);
                        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Tải ảnh thành công!!!!');
                        resolve(result);

                    }, 1000); //Chờ 1 giây (1000 milliseconds)
                });
                writer.on('error', reject);
               

            });
        } catch (error) {
            console.error('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Lỗi khi tải ảnh về máy:', error.message, url);
        }
    }


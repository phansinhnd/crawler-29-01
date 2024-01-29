const sources = [];

const regionArr = ['ho-chi-minh', 'hanoi',
  'an-giang', 'ba-vi', 'bac-lieu', 'bac-ninh', 'bao-loc', 'ben-tre', 'bien-hoa', 'buon-me-thuot', 'ca-mau', 'can-tho',
  'cat-ba', 'con-dao', 'dalat', 'da-nang', 'dien-bien', 'do-son', 'dong-nai', 'halong', 'ha-nam', 'ha-noi-mo-rong',
  'ha-tinh', 'hai-duong', 'haiphong', 'hoa-binh', 'hoi-an', 'hue', 'kien-giang', 'kon-tum', 'lai-chau', 'lang-son',
  'lao-cai', 'nghe-an', 'nha-trang', 'ninh-binh', 'ninh-thuan', 'phan-thiet', 'phu-quoc', 'phu-yen', 'pleiku',
  'quang-binh', 'quang-ngai', 'quang-ninh', 'quang-tri', 'quy-nhon', 'sapa', 'soc-trang', 'son-la', 'tam-dao',
  'tam-ky', 'tay-ninh', 'thanh-hoa', 'tien-giang', 'vung-tau'];

// eslint-disable-next-line no-restricted-syntax
for (const item of regionArr) {
  // eslint-disable-next-line no-restricted-syntax
  // for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) {
    const url = `https://khachsan.chudu24.com/t.${item}.html?types=resort&order=`;
    sources.push({
      url,
      userData: {
        category_lv1_name: 'Resort',
        page: 'LIST',
      },
    });
  // }
}

// eslint-disable-next-line no-restricted-syntax
for (const item of regionArr) {
  // eslint-disable-next-line no-restricted-syntax
  // for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) {
    const url = `https://khachsan.chudu24.com/t.${item}.html?types=khachsan&order=`;
    sources.push({
      url,
      userData: {
        category_lv1_name: 'Khách sạn',
        page: 'LIST',
      },
    });
  // }
}

// eslint-disable-next-line no-restricted-syntax
for (const item of regionArr) {
  // eslint-disable-next-line no-restricted-syntax
  // for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) {
    const url = `https://khachsan.chudu24.com/t.${item}.html?types=villa&order=`;
    sources.push({
      url,
      userData: {
        category_lv1_name: 'Villa',
        page: 'LIST',
      },
    });
  // }
}

// eslint-disable-next-line no-restricted-syntax
for (const item of regionArr) {
  // eslint-disable-next-line no-restricted-syntax
  // for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) {
    const url = `https://khachsan.chudu24.com/t.${item}.html?types=canho&order=`;
    sources.push({
      url,
      userData: {
        category_lv1_name: 'Căn hộ',
        page: 'LIST',
      },
    });
  // }
}

module.exports = sources;

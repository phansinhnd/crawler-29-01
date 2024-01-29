
// sources = [];
// // for (let i = 0; i <= 113; i++) {
//   for (let i = 0; i <= 10; i++) {
//   if (i === 0) {
//     sources.push({
//       url: 'https://www.tripadvisor.com.vn/Restaurants-g293924-Hanoi.html',
//       userData: {
//         category_lv1_name: 'Nhà hàng',
//         page: 'LIST',
//       },
//     });
//   }
//   else {
//     sources.push({
//       url: `https://www.tripadvisor.com.vn/Restaurants-g293924-oa${30 * i}-Hanoi.html`,
//       userData: {
//         category_lv1_name: 'Nhà hàng',
//         page: 'LIST',
//       },
//     });

//   }
// }

const sources = [
  {
    url: 'https://www.tripadvisor.com.vn/Restaurants-g293924-Hanoi.html',
    // url: 'https://www.tripadvisor.com.vn/Tourism-g293925-Ho_Chi_Minh_City-Vacations.html',
    // url: 'https://www.tripadvisor.com.vn/Restaurants-g311304-Sapa_Lao_Cai_Province.html',
    userData: {
      category_lv1_name: 'Nhà hàng',
      page: 'LIST',
    },
  },
  // {
  //   url: 'https://www.tripadvisor.com.vn/Restaurants-g303946-Vung_Tau_Ba_Ria_Vung_Tau_Province.html',
  //   // url: 'https://www.tripadvisor.com.vn/Tourism-g293925-Ho_Chi_Minh_City-Vacations.html',
  //   // url: 'https://www.tripadvisor.com.vn/Restaurants-g311304-Sapa_Lao_Cai_Province.html',
  //   userData: {
  //     category_lv1_name: 'Nhà hàng',
  //     page: 'LIST',
  //   },
  // }
];


// eslint-disable-next-line no-unused-vars,no-restricted-syntax
// for (const i of [2]) {
//   const items = 30 * (i - 1);
//   const itemPages = `oa${items}`;
//   const url = `https://www.tripadvisor.com.vn/Restaurants-g293925-${itemPages}-Ho_Chi_Minh_City.html`;
//   sources.push({
//     url,
//     userData: {
//       category_lv1_name: 'Nhà hàng',
//       page: 'LIST',
//     },
//   });
// }

module.exports = sources;

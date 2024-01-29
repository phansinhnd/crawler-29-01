const sources = [];
// eslint-disable-next-line max-len
// const HNArr = ['quan-ba-dinh', 'quan-hoan-kiem', 'quan-tay-ho', 'quan-long-bien', 'quan-cau-giay', 'quan-dong-da',
// eslint-disable-next-line max-len
//   'quan-hai-ba-trung', 'quan-hoang-mai', 'quan-thanh-xuan', 'huyen-soc-son', 'huyen-dong-anh', 'huyen-gia-lam',
//   'huyen-tu-liem'];
// eslint-disable-next-line no-restricted-syntax
// for (const item of HNArr) {
//   // eslint-disable-next-line no-plusplus
//   for (let i = 1; i < 100; i++) {
//     const url = `https://loship.vn/ha-noi/danh-sach-dia-diem-giao-tan-noi-o-${item}?page=${i}`;
//     sources.push({
//       url,
//       userData: {
//         category_lv1_name: 'Khu vực Hà Nội',
//         page: 'LIST',
//       },
//     });
//   }
// }
//
// eslint-disable-next-line max-len
// const HCMArr = ['quan-1', 'quan-12', 'quan-thu-duc', 'quan-9', 'quan-go-vap', 'quan-binh-thach', 'quan-tan-binh',
// eslint-disable-next-line max-len
//   'quan-tan-phu', 'quan-phu-nhuan', 'quan-2', 'quan-3', 'quan-10', 'quan-11', 'quan-4', 'quan-5', 'quan-6', 'quan-8',
// eslint-disable-next-line max-len
//   'quan-binh-tan', 'quan-7', 'huyen-cu-chi', 'huyen-hoc-mon', 'huyen-binh-chanh', 'huyen-nha-be', 'huyen-can-gio'];
//
// // eslint-disable-next-line no-restricted-syntax
// for (const item of HCMArr) {
//   // eslint-disable-next-line no-plusplus
//   for (let i = 1; i < 100; i++) {
//     const url = `https://loship.vn/ha-noi/danh-sach-dia-diem-giao-tan-noi-o-${item}?page=${i}`;
//     sources.push({
//       url,
//       userData: {
//         category_lv1_name: 'Khu vực Hồ Chí Minh',
//         page: 'LIST',
//       },
//     });
//   }
// }
const url = 'https://loship.vn/ha-noi/danh-sach-dia-diem-giao-tan-noi-o-quan-long-bien?page=1';
sources.push({
  url,
  userData: {
    category_lv1_name: 'Khu vực Hà Nội',
    page: 'LIST',
  },
});

module.exports = sources;

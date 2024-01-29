const mapping = {
  'Thứ hai': 1,
  'Thứ ba': 2,
  'Thứ tư': 3,
  'Thứ năm': 4,
  'Thứ sáu': 5,
  'Thứ bảy': 6,
  'Chủ nhật': 0,
};
module.exports = (name) => mapping[name];

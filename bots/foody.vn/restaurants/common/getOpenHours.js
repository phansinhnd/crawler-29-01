module.exports = (page) => page.evaluate(() => {
  const convertToTimeRange = (str) => str.split(/[-|]/g)
    .map((item) => item.split(':').map((val) => parseFloat(val)))
    .map((item) => item
      .reduce(
        (accumulator, currentValue, currentIndex) => ((currentIndex === 0)
          ? accumulator + currentValue * 60
          : accumulator + currentValue),
        0,
      ));

  const mapping = {
    'Thứ hai': 1,
    'Thứ ba': 2,
    'Thứ tư': 3,
    'Thứ năm': 4,
    'Thứ sáu': 5,
    'Thứ bảy': 6,
    'Chủ nhật': 0,
  };
  const getDayOfWeekFromName = (name) => mapping[name];

  const openHours = {};
  if ($('.opening-time-content').length) {
    console.log('GET_OPEN_TIME_FROM_TABLE');
    $('.opening-time-content .date-box').each(function () {
      const name = $(this).find('.date-header').text().trim();
      const dayOfWeek = getDayOfWeekFromName(name);
      const timeRanges = convertToTimeRange($(this).find('.date-content').text().trim());

      openHours[dayOfWeek] = {
        start: timeRanges[0],
        end: timeRanges[1],
      };
    });
  } else {
    console.log('GET_OPEN_TIME_FROM_TEXT');
    const timeRanges = convertToTimeRange($('.fa-exclamation-circle').prev('span').text().trim());

    [0, 1, 2, 3, 4, 5, 6].forEach((value) => {
      openHours[value] = {
        start: timeRanges[0],
        end: timeRanges[1],
      };
    });
  }

  return openHours;
});

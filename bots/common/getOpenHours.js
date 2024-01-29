module.exports = ($, page) => page.evaluate(() => {
  const hours = [];
  const dayMapping = {
    'T2': '1',
    'T3': '2',
    'T4': '3',
    'T5': '4',
    'T6': '5',
    'T7': '6',
    'CN': '7',
  };

  function convertTimeToSeconds(timeString) {
    const timeParts = timeString.split(':');
    let hour = parseInt(timeParts[0], 10);
    const minute = parseInt(timeParts[1], 10);

    // Kiểm tra buổi AM hoặc PM và điều chỉnh giờ nếu cần
    const isPM = timeString.includes('CH');
    if (isPM && hour !== 12) {
      // eslint-disable-next-line no-const-assign
      hour += 12;
    } else if (!isPM && hour === 12) {
      hour = 0;
    }
    // Tính thời gian tính bằng giây
    return (hour * 60) + minute;
  }

  // eslint-disable-next-line func-names
  $('.RiEuX').each(function () {
    const day = $(this).find('.BhOTk').text();
    // eslint-disable-next-line func-names
    const startTime = $(this).find('.lieuc span:eq(0)').text().trim();
    const endTime = $(this).find('.lieuc span:eq(4)').text().trim();

    const openTime = {
      day: dayMapping[day],
      // eslint-disable-next-line no-use-before-define
      startTime: convertTimeToSeconds(startTime),
      // eslint-disable-next-line no-use-before-define
      endTime: convertTimeToSeconds(endTime),
    };

    hours.push(openTime);
  });
  return hours;


});

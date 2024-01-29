module.exports = (str) => str.split(/[-|]/g)
  .map((item) => item.split(':').map((val) => parseFloat(val)))
  .map((item) => item
    .reduce(
      (accumulator, currentValue, currentIndex) => ((currentIndex === 0)
        ? accumulator + currentValue * 60
        : accumulator + currentValue),
      0,
    ));

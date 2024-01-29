module.exports = ($, page) => page.evaluate(() => {
  const getDescription = $('.kqcdz .ui_column').length > 1 ? $('.kqcdz .ui_column:eq(1)') : $('.kqcdz .ui_column');

  let descriptionNew = '';

  // eslint-disable-next-line func-names
  getDescription.each(function () {
    const des = $(this);

    des.find(".tbUiL:contains('ĐẶC TRƯNG')").parent().remove();
    des.find(".tbUiL:contains('ĐẶC TRƯNG')").parent().remove();

    descriptionNew += des.html();
  });

  return descriptionNew;
});

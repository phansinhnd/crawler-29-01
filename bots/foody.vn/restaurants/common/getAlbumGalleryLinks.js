module.exports = (page, selector = '.micro-home-album-img .thumb-image') => page.evaluate((select) => {
  const albums = [];
  $(select).each(function () {
    albums.push($(this).find('a').attr('href'));
  });

  return {
    logo_url: albums.length >= 1 ? albums[0] : '',
    banner_url: albums.length >= 2 ? albums[1] : '',
    thumbnail_urls: albums,
  };
}, selector);

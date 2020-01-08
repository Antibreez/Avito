'use strict';

(function (
    backend,
    Gallery
) {
  if (!Gallery) {
    return;
  }

  var gallery = new Gallery();

  function onAdsLoad (ads) {
    gallery.add(ads);
  }

  backend.loadAll(onAdsLoad);

})(
    window.backend,
    window.Gallery
);


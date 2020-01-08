'use strict';

(function (
    backend,
    makeFragmentRender
){
  var title = document.querySelector('.ad-current__title');
  var address = document.querySelector('.ad-current__address');
  var description = document.querySelector('.ad-current__description');
  var name = document.querySelector('.ad-current__name');
  var price = document.querySelector('.ad-current__price');
  var fullImage = document.querySelector('.ad-current__full-image');
  var photoPreview = document.querySelector('.ad-current__previews');
  var exit = document.querySelector('.ad-current__exit');

  if (!title) {
    return;
  }

  var imageTemplate = document.querySelector('#preview').content.querySelector('.preview-container');

  var id = +localStorage.getItem('currentId');

  var renderImage = function (imageSrc, idx) {
    var node = imageTemplate.cloneNode(true);
    var num = idx + 1;
    var image = node.querySelector('.preview');

    image.src = imageSrc;
    image.alt = 'Фото ' + num;

    return node;
  };

  var getImagesFragment = makeFragmentRender(renderImage);

  var onPreviewClick = function (evt) {
    var target = evt.target.classList.contains('preview') ? evt.target
      : null;

    if (target) {
      fullImage.src = target.src;
    }
  };

  var onExitClick = function () {
    photoPreview.removeEventListener('click', onPreviewClick);
  }

  var onAdLoad = function (ad) {
    title.textContent = ad[0].title;
    address.textContent = ad[0].address;
    description.textContent = ad[0].description;
    name.textContent = ad[0].sellerName;
    price.textContent = ad[0].price;

    var images = ad[0].images;

    photoPreview.appendChild(getImagesFragment(images));
    fullImage.src = images[0];

    photoPreview.addEventListener('click', onPreviewClick);
  };

  backend.loadCurrent(id, onAdLoad);
})(
    window.backend,
    window.DomUtil.makeFragmentRender
);

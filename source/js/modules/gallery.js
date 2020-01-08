'use strict';

(function (
  makeFragmentRender
){
  var adList = document.querySelector('.ads');

  if (!adList) {
    return;
  }

  var adTemplate = document.querySelector('#ad').content.querySelector('.ad');

  var renderAd = function (ad) {
    var node = adTemplate.cloneNode(true);
    node.querySelector('h2').textContent = ad.title;
    node.querySelector('.ad__preview').src = ad.previewImage;
    node.querySelector('.ad__preview').alt = ad.title;
    node.querySelector('.ad__address').textContent = ad.address;
    node.querySelector('.ad__price').textContent = ad.price;
    node.dataset.id = ad.id;

    return node;
  }

  var getAdFragment = makeFragmentRender(renderAd);

  var setAds = function (ads) {
    adList.appendChild(getAdFragment(ads));
  };

  var Gallery = function () {
    this._onItemClick = this._onItemClick.bind(this);
    this._removeEventListeners = this._removeEventListeners.bind(this);

    this._addEventListeners();
  };

  Gallery.prototype.add = function (ads) {
    setAds(ads);
  };

  Gallery.prototype._onItemClick = function (evt) {
    var target = evt.target.classList.contains('ad') ? evt.target
      : evt.target.parentNode.classList.contains('ad') ? evt.target.parentNode
      : null;

    if (target) {
      localStorage.setItem('currentId', +target.dataset.id);

      document.location.href = 'review.html';

      this._removeEventListeners();
    }
  };

  Gallery.prototype._addEventListeners = function () {
    adList.addEventListener('click', this._onItemClick);
  };

  Gallery.prototype._removeEventListeners = function () {
    adList.removeEventListener('click', this._onItemClick);
  };

  window.Gallery = Gallery;
})(
    window.DomUtil.makeFragmentRender
);

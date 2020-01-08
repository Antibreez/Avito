'use strict';

(function () {
  var forEach = Array.prototype.forEach;

  var clearInput = function (input) {
    input.value = '';
  };

  window.DomUtil = {
    isHidden: function (element) {
      return element.classList.contains('hidden');
    },

    show: function (element) {
      element.classList.remove('hidden');
    },

    hide: function (element) {
      element.classList.add('hidden');
    },

    clear: function () {
      forEach.call(arguments, clearInput);
    },

    makeFragmentRender: function (render) {
      return function (dataList) {
        var fragment = document.createDocumentFragment();
        dataList.forEach(function (data, idx) {
          fragment.appendChild(render(data, idx));
        });

        return fragment;
      };
    }
  };
})();

'use strict';

(function () {
  // var ReqUrl = {
  //   GET: 'http://134.209.138.34/items',
  // };

  var getReqUrl = function (id) {
    return id ? 'http://134.209.138.34/item/' + id : 'http://134.209.138.34/items';
  };

  var ReqMethod = {
    GET: 'GET',
  };

  var ReqStatus = {
    OK: 200,
    MULTIPLE_CHOICES: 300,
  };

  var TIMEOUT = 10000;

  var isErrorStatus = function (xhr) {
    return xhr.status < ReqStatus.OK
      || xhr.status > ReqStatus.MULTIPLE_CHOICES;
  };

  var createRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.timeout = TIMEOUT;
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (isErrorStatus(xhr)) {
        onError('Данные не загрузились. Причина: ' + xhr.status + ' ' + xhr.statusText);
        return;
      }

      onLoad(xhr.response);
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    return xhr;
  };

  var removeElement = function (element) {
    element.remove();
  };

  var onAnyError = function (message) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = message;
    document.body.insertAdjacentElement('afterbegin', node);
    window.setTimeout(removeElement, 2000, node);
  };

  window.backend = {
    loadAll: function (onLoad, onError) {
      var req = createRequest(onLoad, onError || onAnyError);
      req.open(ReqMethod.GET, getReqUrl());
      req.send();
    },

    loadCurrent: function (id, onLoad, onError) {
      var req = createRequest(onLoad, onError || onAnyError);
      req.open(ReqMethod.GET, getReqUrl(id));
      req.send();
    }
  };
})();

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


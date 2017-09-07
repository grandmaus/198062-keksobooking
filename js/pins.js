'use strict';

(function () {
  var pinTemplate = document.querySelector('#pin-template').content;

  var renderPin = function (ad) {
    var pinFragment = pinTemplate.cloneNode(true);
    var pinElement = pinFragment.querySelector('.pin');
    // размеры метки
    var pinWidth = 56;
    var pinHeight = 75;
    // по оси x отнимаем половину ширины, по оси y высоту, чтобы на координату указывал острый конец маркера
    var pinCoordinateX = 'left: ' + (ad.location.x - pinWidth / 2) + 'px';
    var pinCoordinateY = 'top: ' + (ad.location.y - pinHeight) + 'px';
    // аватарка пина
    var pinImage = pinElement.querySelector('.rounded');

    pinElement.setAttribute('style', pinCoordinateX + '; ' + pinCoordinateY);
    pinImage.setAttribute('src', ad.author.avatar);
    pinElement.setAttribute('tabindex', '0');

    return pinElement;
  };

  // добавляет обработчики на пины
  var pinHandlersAdd = function (pin, ad) {
    pin.addEventListener('click', function (evt) {
      pinClickHandler(evt, ad);
    });

    pin.addEventListener('keydown', function (evt) {
      window.utils.isEnterEvent(evt, function () {
        pinClickHandler(evt, ad);
      });
    });
  };

  var createPin = function (ad) {
    var pin = renderPin(ad);
    pinHandlersAdd(pin, ad);
    return pin;
  };

  var pinClickHandler = function (evt, ad) {
    window.pins.deactivatePin();
    evt.currentTarget.classList.add('pin--active');
    window.card.show(ad);
  };

  window.pins = {
    // функция возвращает фрагмент с DOM нодами маркеров
    createPinFragment: function () {
      var fragment = document.createDocumentFragment();
      var randomPin;

      for (var i = 0; i < window.data.AD_COUNT; i++) {
        randomPin = window.data.getAd(i);
        fragment.appendChild(createPin(randomPin));
      }

      return fragment;
    },

    // функция деактивирует пин
    deactivatePin: function () {
      var pinActive = document.querySelector('.pin--active');

      if (pinActive) {
        pinActive.classList.remove('pin--active');
      }
    }
  };
})();

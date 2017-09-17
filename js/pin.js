'use strict';

(function () {
  // размеры метки
  var PIN_WIDTH = 56;
  var PIN_HEIGHT = 75;

  var pinActive;

  var pinTemplate = document.querySelector('#pin-template').content;

  var renderPin = function (ad) {
    var pinFragment = pinTemplate.cloneNode(true);
    var pinElement = pinFragment.querySelector('.pin');
    // по оси x отнимаем половину ширины, по оси y высоту, чтобы на координату указывал острый конец маркера
    var pinCoordinateX = 'left: ' + (ad.location.x - PIN_WIDTH / 2) + 'px';
    var pinCoordinateY = 'top: ' + (ad.location.y - PIN_HEIGHT) + 'px';
    // аватарка пина
    var pinImage = pinElement.querySelector('.rounded');

    pinElement.setAttribute('style', pinCoordinateX + '; ' + pinCoordinateY);
    pinImage.setAttribute('src', ad.author.avatar);
    pinElement.setAttribute('tabindex', '0');

    return pinElement;
  };

  // добавляет обработчики на пины
  var addPinHandlers = function (pin, ad) {
    pin.addEventListener('click', function (evt) {
      pinClickHandler(evt, ad);
    });

    pin.addEventListener('keydown', function (evt) {
      if (window.utils.isEnterPressed(evt.keyCode)) {
        pinClickHandler(evt, ad);
      }
    });
  };

  var pinClickHandler = function (evt, ad) {
    window.pin.deactivate();
    pinActive = evt.currentTarget;
    evt.currentTarget.classList.add('pin--active');
    window.card.show(ad);
  };

  window.pin = {
    create: function (ad) {
      var pin = renderPin(ad);
      addPinHandlers(pin, ad);

      return pin;
    },

    // функция деактивирует пин
    deactivate: function () {
      if (pinActive) {
        pinActive.classList.remove('pin--active');
      }
    }
  };
})();

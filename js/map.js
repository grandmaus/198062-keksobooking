'use strict';

window.map = (function () {
  var AD_COUNT = 8;
  var pinsContainer = document.querySelector('.tokyo__pin-map');

  // функция возвращает фрагмент с DOM нодами маркеров
  var createPinFragment = function () {
    var fragment = document.createDocumentFragment();
    var randomPin;

    for (var i = 0; i < AD_COUNT; i++) {
      randomPin = window.data.getAd(i);
      fragment.appendChild(window.pin.createPin(randomPin));
    }

    return fragment;
  };

  // вставляем фрагмент с маркерами на страницу
  pinsContainer.appendChild(createPinFragment());
})();

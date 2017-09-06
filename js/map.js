'use strict';

(function () {
  var pinsContainer = document.querySelector('.tokyo__pin-map');

  // вставляем фрагмент с маркерами на страницу
  pinsContainer.appendChild(window.pin.createPinFragment());
})();

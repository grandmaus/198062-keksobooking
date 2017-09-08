'use strict';

window.map = (function () {
  var AD_COUNT = 8;

  var map = document.querySelector('.tokyo');
  var pinsContainer = map.querySelector('.tokyo__pin-map');
  var header = document.querySelector('.header');
  var filter = map.querySelector('.tokyo__filters-container');
  var pinMain = map.querySelector('.pin__main');
  var addressField = document.querySelector('#address');

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

  pinMain.addEventListener('mousedown', function (evt) {

    // записываем начальные координаты
    var startCoordinates = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      // при каждом движении мыши обновляем координаты пина
      var shift = {
        x: startCoordinates.x - moveEvt.clientX,
        y: startCoordinates.y - moveEvt.clientY
      };

      var mapMaxWidth = map.clientWidth;
      var mapMaxHeight = map.clientHeight;

      var maxCoordinateX = mapMaxWidth - pinMain.clientWidth / 2;
      var minCoordinateX = 0 - pinMain.clientWidth / 2;
      var maxCoordinateY = mapMaxHeight - pinMain.clientHeight - filter.clientHeight;
      var minCoordinateY = 0 + header.clientHeight;

      var pinY = pinMain.offsetTop - shift.y;
      var pinX = pinMain.offsetLeft - shift.x;

      // Проверяем координаты, чтобы пин не вышел за пределы карты
      var checkCoordinates = function () {
        if (pinX > maxCoordinateX) {
          pinX = maxCoordinateX;
        } else if (pinX < minCoordinateX) {
          pinX = minCoordinateX;
        } else if (pinY > maxCoordinateY) {
          pinY = maxCoordinateY;
        } else if (pinY < minCoordinateY) {
          pinY = minCoordinateY;
        }
      };

      checkCoordinates();

      // переопределяем начальные координаты пина
      startCoordinates = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      pinMain.style.top = pinY + 'px';
      pinMain.style.left = pinX + 'px';

      var valueX = pinX + pinMain.clientWidth / 2;
      var valueY = pinY + pinMain.clientHeight;

      addressField.value = 'x: ' + valueX + ', y: ' + valueY;
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  addressField.setAttribute('readonly', '');

  // вставляем фрагмент с маркерами на страницу
  pinsContainer.appendChild(createPinFragment());
})();

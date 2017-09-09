'use strict';

window.map = (function () {
  var AD_COUNT = 8;

  var map = document.querySelector('.tokyo');
  var pinsContainer = map.querySelector('.tokyo__pin-map');
  // var header = document.querySelector('.header');
  // var filter = map.querySelector('.tokyo__filters-container');
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

      // размеры пина
      var pinSizes = {
        WIDTH: 75,
        HEIGHT: 94
      };

      // высоты хедера и панели с фильтром
      var headerHeight = 71;
      var filterPanelHeight = 46;

      // при каждом движении мыши обновляем координаты пина
      var shift = {
        x: startCoordinates.x - moveEvt.clientX,
        y: startCoordinates.y - moveEvt.clientY
      };

      var maxCoordinateX = map.clientWidth - pinSizes.WIDTH / 2;
      var minCoordinateX = 0 - pinSizes.WIDTH / 2;
      var maxCoordinateY = map.clientHeight - pinSizes.HEIGHT - filterPanelHeight;
      var minCoordinateY = 0 + headerHeight;

      var pinY = pinMain.offsetTop - shift.y;
      var pinX = pinMain.offsetLeft - shift.x;

      // Проверяем координаты, чтобы пин не вышел за пределы карты
      var checkCoordinates = function () {
        if (pinX > maxCoordinateX) {
          pinX = maxCoordinateX;
        }
        if (pinX < minCoordinateX) {
          pinX = minCoordinateX;
        }
        if (pinY > maxCoordinateY) {
          pinY = maxCoordinateY;
        }
        if (pinY < minCoordinateY) {
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

      var valueX = pinX + pinSizes.WIDTH / 2;
      var valueY = pinY + pinSizes.HEIGHT;

      addressField.value = 'x: ' + valueX + ', y: ' + valueY;
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    addressField.setAttribute('readonly', '');
  });

  // вставляем фрагмент с маркерами на страницу
  pinsContainer.appendChild(createPinFragment());
})();

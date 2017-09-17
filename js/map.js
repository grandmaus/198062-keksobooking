'use strict';

(function () {
  // высоты хедера и панели с фильтром
  var HEADER_HEIGHT = 71;
  var FILTER_PANEL_HEIGHT = 46;

  var map = document.querySelector('.tokyo');
  var pinMain = map.querySelector('.pin__main');
  var addressField = document.querySelector('#address');

  // размеры пина
  var pinSize = {
    WIDTH: 75,
    HEIGHT: 94
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

      var maxCoordinateX = map.clientWidth - pinSize.WIDTH / 2;
      var minCoordinateX = 0 - pinSize.WIDTH / 2;
      var maxCoordinateY = map.clientHeight - pinSize.HEIGHT - FILTER_PANEL_HEIGHT;
      var minCoordinateY = 0 + HEADER_HEIGHT;

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

      var valueX = pinX + pinSize.WIDTH / 2;
      var valueY = pinY + pinSize.HEIGHT;

      addressField.value = 'x: ' + valueX + ', y: ' + valueY;
      addressField.classList.remove('invalid');
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.className = 'error-message';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var successHandler = function (offers) {
    window.filters(offers);
  };

  window.backend.load(successHandler, errorHandler);
})();

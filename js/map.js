'use strict';

window.map = (function () {

  var map = document.querySelector('.tokyo');
  var pinsContainer = map.querySelector('.tokyo__pin-map');
  var pinMain = map.querySelector('.pin__main');
  var addressField = document.querySelector('#address');

  var filterForm = map.querySelector('.tokyo__filters');
  var type = filterForm.querySelector('#housing_type');
  var price = filterForm.querySelector('#housing_price');
  var rooms = filterForm.querySelector('#housing_room-number');
  var guests = filterForm.querySelector('#housing_guests-number');
  var housingFeatures = filterForm.querySelectorAll('input[type = "checkbox"]');

  var offersArray = [];

  // функция возвращает фрагмент с DOM нодами маркеров
  var createPinFragment = function (array) {
    var fragment = document.createDocumentFragment();

    array.forEach(function (pin) {
      fragment.appendChild(window.pin.createPin(pin));
    });

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
      var HEADER_HEIGHT = 71;
      var FILTER_PANEL_HEIGHT = 46;

      // при каждом движении мыши обновляем координаты пина
      var shift = {
        x: startCoordinates.x - moveEvt.clientX,
        y: startCoordinates.y - moveEvt.clientY
      };

      var maxCoordinateX = map.clientWidth - pinSizes.WIDTH / 2;
      var minCoordinateX = 0 - pinSizes.WIDTH / 2;
      var maxCoordinateY = map.clientHeight - pinSizes.HEIGHT - FILTER_PANEL_HEIGHT;
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
  });

  // функция очищает карту от всех пинов, кроме pin_main
  var clearMap = function () {
    pinsContainer.innerHTML = '';
    pinsContainer.appendChild(pinMain);
  };

  var updatePins = function (offers) {
    offersArray = offers;

    var filteredOffers = offersArray;

    // функция для сравнения характеристик(type, guests, rooms)
    var selectPropertyFilter = function (field, property) {
      filteredOffers = filteredOffers.filter(function (element) {
        return field.value === 'any' ? true : element.offer[property].toString() === field.value;
      });
    };

    // сравнение по цене
    filteredOffers = filteredOffers.filter(function (element) {
      var result;
      switch (price.value) {
        case 'middle':
          result = element.offer.price >= 10000 && element.offer.price <= 50000;
          break;
        case 'low':
          result = element.offer.price <= 10000;
          break;
        case 'high':
          result = element.offer.price > 50000;
          break;
        default:
          result = element.offer.price;
      }
      return result;
    });

    [].forEach.call(housingFeatures, function (checkbox) {
      if (checkbox.checked) {
        filteredOffers = filteredOffers.filter(function (offerItem) {
          return offerItem.offer.features.includes(checkbox.value);
        });
      }
    });

    selectPropertyFilter(type, 'type');
    selectPropertyFilter(rooms, 'rooms');
    selectPropertyFilter(guests, 'guests');

    clearMap();
    pinsContainer.appendChild(createPinFragment(filteredOffers));
  };

  filterForm.addEventListener('change', function () {
    window.utils.debounce(updatePins(offersArray));
  });

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.className = 'error-message';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var succesHandler = function (offers) {
    offersArray = offers;
    updatePins(offersArray);
  };

  window.backend.load(succesHandler, errorHandler);
})();

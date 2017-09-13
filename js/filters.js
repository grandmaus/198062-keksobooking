'use strict';

window.filters = (function () {

  var map = document.querySelector('.tokyo');
  var pinsContainer = map.querySelector('.tokyo__pin-map');
  var pinMain = map.querySelector('.pin__main');
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

  // функция очищает карту от всех пинов, кроме pin_main
  var clearMap = function () {
    pinsContainer.innerHTML = '';
    pinsContainer.appendChild(pinMain);
  };

  filterForm.addEventListener('change', function () {
    window.utils.debounce(function () {
      window.filters.updatePins(offersArray);
    });
  });

  return {
    updatePins: function (offers) {
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
        var filterPriceMap = {
          'any': true,
          'middle': element.offer.price >= 10000 && element.offer.price <= 50000,
          'low': element.offer.price < 10000,
          'high': element.offer.price > 50000,
        };

        return filterPriceMap[price.value];
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
    }
  };
})();

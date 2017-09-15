'use strict';

window.filters = (function () {
  var map = document.querySelector('.tokyo');
  var offerDialog = map.querySelector('#offer-dialog');
  var pinsContainer = map.querySelector('.tokyo__pin-map');
  var pinMain = map.querySelector('.pin__main');
  var filterForm = map.querySelector('.tokyo__filters');

  var type = filterForm.querySelector('#housing_type');
  var price = filterForm.querySelector('#housing_price');
  var rooms = filterForm.querySelector('#housing_room-number');
  var guests = filterForm.querySelector('#housing_guests-number');

  var offersArray = [];

  // функция возвращает фрагмент с DOM нодами маркеров
  var createPinFragment = function (array) {
    var fragment = document.createDocumentFragment();

    array.forEach(function (pin) {
      fragment.appendChild(window.pin.create(pin));
    });

    return fragment;
  };

  // функция очищает карту от всех пинов, кроме pin_main
  var clearMap = function () {
    offerDialog.classList.add('hidden');
    pinsContainer.innerHTML = '';
    pinsContainer.appendChild(pinMain);
  };

  var updatePins = function (offers) {
    offersArray = offers;

    var filteredOffers = offersArray;

    var housingFeaturesChecked = filterForm.querySelectorAll('input[type = "checkbox"]:checked');

    // функция для сравнения характеристик(type, guests, rooms)
    var selectPropertyFilter = function (field, property) {
      if (field.value !== 'any') {
        filteredOffers = filteredOffers.filter(function (element) {
          return element.offer[property].toString() === field.value;
        });
      }
    };

    // сравнение по цене
    filteredOffers = filteredOffers.filter(function (element) {
      var filterPriceMap = {
        'any': true,
        'middle': element.offer.price >= 10000 && element.offer.price <= 50000,
        'low': element.offer.price < 10000,
        'high': element.offer.price > 50000,
        'default': false
      };

      return filterPriceMap[price.value] || filterPriceMap['default'];
    });

    [].forEach.call(housingFeaturesChecked, function (checkbox) {
      filteredOffers = filteredOffers.filter(function (offerItem) {
        return ~offerItem.offer.features.indexOf(checkbox.value);
      });
    });

    selectPropertyFilter(type, 'type');
    selectPropertyFilter(rooms, 'rooms');
    selectPropertyFilter(guests, 'guests');

    clearMap();
    // window.card.hide();
    pinsContainer.appendChild(createPinFragment(filteredOffers));
  };

  var callUpdatePins = function () {
    updatePins(offersArray);
  };

  filterForm.addEventListener('change', function () {
    window.utils.debounce(callUpdatePins);
  });

  return updatePins;
})();

'use strict';

(function () {
  // перемнные для валидации формы
  var form = document.querySelector('.notice__form');
  var adTitleField = form.querySelector('#title');
  var adAddressField = form.querySelector('#address');
  var adPriceField = form.querySelector('#price');
  var adTimeinField = form.querySelector('#timein');
  var adTimeoutField = form.querySelector('#timeout');
  var adTypeField = form.querySelector('#type');
  var adRoomField = form.querySelector('#room_number');
  var adCapacityField = form.querySelector('#capacity');
  var optionsArray = adCapacityField.querySelectorAll('option');

  // объекты соответствия для полей формы
  var PRICE_TYPES = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };

  var ROOMS_CAPACITY_MAP = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
  };

  // функция переключает класс invalid
  // Если поле валидно, !target.validity.valid возвращает false
  var validationInputHandler = function (evt) {
    evt.preventDefault();
    evt.target.classList.toggle('invalid', !evt.target.validity.valid);
  };

  var addFormValidationHandlers = function () {
    form.addEventListener('invalid', validationInputHandler, true);

    adTitleField.addEventListener('input', validationInputHandler);
    adAddressField.addEventListener('input', validationInputHandler);
    adPriceField.addEventListener('input', validationInputHandler);
  };

  // обработчик для связывания времени заезда/выезда
  var associateTimeHandler = function (currentSelect, changedSelect) {
    changedSelect.value = currentSelect.value;
  };

  // обработчик для связывания типа жилья и цены
  var associatePriceHandler = function (currentField, changedField) {
    changedField.min = PRICE_TYPES[currentField.value];
  };

  // функция для связывания количества комнат и гостей
  var associateCapacityHandler = function () {
    adRoomField.addEventListener('change', function (evt) {
      var currentValue = evt.target.value;

      for (var i = 0; i < optionsArray.length; i++) {
        var value = optionsArray[i].value;
        // если элемент не найден, то disabled = true
        optionsArray[i].disabled = !(~ROOMS_CAPACITY_MAP[currentValue].indexOf(value));
        optionsArray[i].selected = (~ROOMS_CAPACITY_MAP[currentValue].indexOf(value));
      }
    });
  };

  // добавляю обработчики формы и полей
  var addFormListeners = function () {
    addFormValidationHandlers();

    adTimeinField.addEventListener('change', function () {
      associateTimeHandler(adTimeinField, adTimeoutField);
    });

    adTimeoutField.addEventListener('change', function () {
      associateTimeHandler(adTimeoutField, adTimeinField);
    });

    adTypeField.addEventListener('change', function () {
      associatePriceHandler(adTypeField, adPriceField);
    });

    associateCapacityHandler();
  };

  addFormListeners();
})();

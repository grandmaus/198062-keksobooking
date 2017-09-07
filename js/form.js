'use strict';

(function () {
  // перемнные для валидации формы
  var form = document.querySelector('.notice__form');
  var titleField = form.querySelector('#title');
  var addressField = form.querySelector('#address');
  var priceField = form.querySelector('#price');
  var timeinField = form.querySelector('#timein');
  var timeoutField = form.querySelector('#timeout');
  var typeField = form.querySelector('#type');
  var roomField = form.querySelector('#room_number');
  var capacityField = form.querySelector('#capacity');
  var optionsArray = capacityField.querySelectorAll('option');

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

    titleField.addEventListener('input', validationInputHandler);
    addressField.addEventListener('input', validationInputHandler);
    priceField.addEventListener('input', validationInputHandler);
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
    roomField.addEventListener('change', function (evt) {
      var currentValue = evt.target.value;

      for (var i = 0; i < optionsArray.length; i++) {
        var value = optionsArray[i].value;
        // если элемент не найден, то disabled = true
        optionsArray[i].disabled = !~ROOMS_CAPACITY_MAP[currentValue].indexOf(value);
        optionsArray[i].selected = ~ROOMS_CAPACITY_MAP[currentValue].indexOf(value);
      }
    });
  };

  // добавляю обработчики формы и полей
  var addFormListeners = function () {
    addFormValidationHandlers();

    timeinField.addEventListener('change', function () {
      associateTimeHandler(timeinField, timeoutField);
    });

    timeoutField.addEventListener('change', function () {
      associateTimeHandler(timeoutField, timeinField);
    });

    typeField.addEventListener('change', function () {
      associatePriceHandler(typeField, priceField);
    });

    associateCapacityHandler();
  };

  addFormListeners();
})();

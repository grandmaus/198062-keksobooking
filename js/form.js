'use strict';

window.form = (function () {
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

  // объекты соответствия и массивы значений для полей формы
  var TYPE_VALUES = [
    'flat',
    'bungalo',
    'house',
    'palace'
  ];

  var PRICE_VALUES = [
    '1000',
    '0',
    '5000',
    '10000'
  ];

  var ROOMS_CAPACITY_MAP = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
  };

  var TIME_VALUES = [
    '12:00',
    '13:00',
    '14:00'
  ];

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

  // обработчик для синхронизации значений полей
  var syncFieldHandler = function (currentField, changedField, currentFieldArray, changedFieldArray) {
    changedField.value = changedFieldArray[currentFieldArray.indexOf(currentField.value)];
  };

  // обработчик для связывания типа жилья и цены
  var syncPriceHandler = function (currentField, changedField, currentFieldArray, changedFieldArray) {
    changedField.min = changedFieldArray[currentFieldArray.indexOf(currentField.value)];
  };

  // функция для связывания количества комнат и гостей
  var syncCapacityHandler = function () {
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

    syncCapacityHandler();
  };

  window.synchronizeFields(timeinField, timeoutField, TIME_VALUES, TIME_VALUES, syncFieldHandler);
  window.synchronizeFields(timeoutField, timeinField, TIME_VALUES, TIME_VALUES, syncFieldHandler);
  window.synchronizeFields(typeField, priceField, TYPE_VALUES, PRICE_VALUES, syncPriceHandler);

  addFormListeners();
})();

'use strict';

(function () {
  // перемнные для валидации формы
  var form = document.querySelector('.notice__form');
  var titleField = form.querySelector('#title');
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
    '10000',
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
  var syncCapacityHandler = function (currentField, changedField, currentFieldArray) {
    [].forEach.call(changedField, function (element) {
      var capacityOption = currentFieldArray[currentField.value].indexOf(element.value);

      // если элемент не найден, то disabled = true
      element.disabled = !~capacityOption;
      element.selected = ~capacityOption;
    });
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.className = 'error-message';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var successHandler = function () {
    var invalidFields = form.querySelectorAll('.invalid');

    [].forEach.call(invalidFields, function (element) {
      element.classList.remove('invalid');
    });

    form.reset();
  };

  var submitFormHandler = function (evt) {
    evt.preventDefault();

    window.backend.save(new FormData(form), successHandler, errorHandler);
  };

  // добавляю обработчики формы и полей
  var addFormListeners = function () {
    addFormValidationHandlers();

    form.addEventListener('submit', submitFormHandler);

    syncCapacityHandler(roomField, optionsArray, ROOMS_CAPACITY_MAP);
    syncPriceHandler(typeField, priceField, TYPE_VALUES, PRICE_VALUES);
  };


  window.synchronizeFields(timeinField, timeoutField, TIME_VALUES, TIME_VALUES, syncFieldHandler);
  window.synchronizeFields(timeoutField, timeinField, TIME_VALUES, TIME_VALUES, syncFieldHandler);
  window.synchronizeFields(typeField, priceField, TYPE_VALUES, PRICE_VALUES, syncPriceHandler);
  window.synchronizeFields(roomField, optionsArray, ROOMS_CAPACITY_MAP, ROOMS_CAPACITY_MAP, syncCapacityHandler);

  addFormListeners();
})();

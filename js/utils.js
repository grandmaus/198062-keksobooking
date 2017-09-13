'use strict';

window.utils = (function () {
  var keyCodes = {
    ESC: 27,
    ENTER: 13
  };

  var DEBOUNCE_INTERVAL = 500; // ms
  var lastTimeout;

  return {
    isEscPressed: function (keyCode) {
      return keyCode === keyCodes.ESC;
    },

    isEnterPressed: function (keyCode) {
      return keyCode === keyCodes.ENTER;
    },

    // функция возвращает случайное целое число
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },

    // функция возвращает случайный элемент массива. В параметр передаётся массив
    getRandomArrayElement: function (array) {
      var elementIndex = this.getRandomNumber(0, array.length);
      var element = array[elementIndex];
      return element;
    },


    // функция возвращает массив случайной длины с неповторяющимися элементами
    getRandomLengthArray: function (array, length, unique) {
      var randomArray = [];
      var arrayElement;

      while (randomArray.length < length) {
        arrayElement = array[this.getRandomNumber(0, array.length)];
        if (unique && ~randomArray.indexOf(arrayElement)) {
          continue;
        } else {
          randomArray.push(arrayElement);
        }
      }

      return randomArray;
    },

    debounce: function (func) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(func, DEBOUNCE_INTERVAL);
    }
  };
})();

'use strict';

window.utils = (function () {
  var keyCodes = {
    ESC: 27,
    ENTER: 13
  };

  return {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === keyCodes.ESC) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === keyCodes.ENTER) {
        action();
      }
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
    }
  };
})();

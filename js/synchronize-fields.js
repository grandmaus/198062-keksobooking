'use strict';

window.synchronizeFields = (function () {

  return function (currentField, changedField, currentFieldArray, callback) {
    currentField.addEventListener('change', function () {
      callback(currentField, changedField, currentFieldArray);
    });
  };
})();

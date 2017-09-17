'use strict';

(function () {
  window.synchronizeFields = function (currentField, changedField, currentFieldArray, changedFieldArray, callback) {
    currentField.addEventListener('change', function () {
      callback(currentField, changedField, currentFieldArray, changedFieldArray);
    });
  };
})();

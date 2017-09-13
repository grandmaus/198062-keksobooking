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

    debounce: function (func) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(func, DEBOUNCE_INTERVAL);
    }
  };
})();

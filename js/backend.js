'use strict';

window.backend = (function () {
  var URL = 'https://1510.dump.academy/keksobooking';

  var setup = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    var STATUS_MAP = {
      '200': function () {
        onLoad(xhr.response);
      },

      '400': function () {
        onError('Неверный запрос');
      },

      '404': function () {
        onError('Ничего не найдено');
      },

      '500': function () {
        onError('Ошибка сервера');
      },

      'default': function () {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    };

    xhr.addEventListener('load', function () {
      (STATUS_MAP[xhr.status] || STATUS_MAP['default'])();
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    return xhr;
  };

  return {
    save: function (data, onLoad, onError) {
      var xhr = setup(onLoad, onError);

      xhr.open('POST', URL);
      xhr.send(data);
    },

    load: function (onLoad, onError) {
      var xhr = setup(onLoad, onError);

      xhr.open('GET', URL + '/data');
      xhr.send();
    }
  };
})();

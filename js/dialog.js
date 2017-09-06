'use strict';

(function () {
  var dialog = document.querySelector('#offer-dialog');
  var dialogClose = dialog.querySelector('.dialog__close');

  var dialogEnterCloseHandler = function (evt) {
    if (evt.keyCode === window.data.keyCodes.ENTER) {
      dialogCloseHandler();
    }
  };

  var dialogEscCloseHandler = function (evt) {
    if (evt.keyCode === window.data.keyCodes.ESC) {
      dialogCloseHandler();
    }
  };

  var dialogAddListeners = function () {
    dialogClose.addEventListener('click', dialogCloseHandler);
    dialogClose.addEventListener('keydown', dialogEnterCloseHandler);
    document.addEventListener('keydown', dialogEscCloseHandler);
  };

  var dialogRemoveListeners = function () {
    dialogClose.removeEventListener('click', dialogCloseHandler);
    dialogClose.removeEventListener('keydown', dialogEnterCloseHandler);
    document.removeEventListener('keydown', dialogEscCloseHandler);
  };

  var dialogCloseHandler = function () {
    hideDialog();
    window.pin.deactivatePin();
  };

  // добавляет попапу класс hidden
  var hideDialog = function () {
    dialog.classList.add('hidden');
    dialogRemoveListeners();
  };

  // добавляю диалогу обработчики закрытия
  dialogAddListeners();

  window.dialog = {
    // убирает у попапа класс hidden
    showDialog: function () {
      dialog.classList.remove('hidden');
      dialogAddListeners();
    }
  };
})();

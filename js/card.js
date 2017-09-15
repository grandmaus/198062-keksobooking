'use strict';

window.card = (function () {
  // переменные для вывода информации на страницу
  var offerDialog = document.querySelector('#offer-dialog');
  var lodgeTemplate = document.querySelector('#lodge-template').content;
  var dialogClose = offerDialog.querySelector('.dialog__close');

  // выводим информацию об объявлении
  var insertAdInformation = function (ad) {
    var lodgeElement = lodgeTemplate.cloneNode(true);
    var lodgeFeatures = lodgeElement.querySelector('.lodge__features');
    var dialogPanel = offerDialog.querySelector('.dialog__panel');

    // переменные для вставки информации об объявлении
    var userAvatar = offerDialog.querySelector('.dialog__title > img');
    var title = lodgeElement.querySelector('.lodge__title');
    var address = lodgeElement.querySelector('.lodge__address');
    var price = lodgeElement.querySelector('.lodge__price');
    var type = lodgeElement.querySelector('.lodge__type');
    var guests = lodgeElement.querySelector('.lodge__rooms-and-guests');
    var checkIn = lodgeElement.querySelector('.lodge__checkin-time');
    var description = lodgeElement.querySelector('.lodge__description');

    // объект для перевода типов жилья на русский язык
    var offerTypes = {
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало'
    };

    title.textContent = ad.offer.title;
    address.textContent = ad.offer.address;
    price.textContent = ad.offer.price + ' \u20bd/ночь';
    type.textContent = offerTypes[ad.offer.type];
    guests.textContent = 'Для ' + ad.offer.guests + ' гостей в ' + ad.offer.rooms + ' комнатах';
    checkIn.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    description.textContent = ad.offer.description;

    for (var i = 0; i < ad.offer.features.length; i++) {
      var featureItem = document.createElement('span');
      featureItem.classList.add('feature__image', 'feature__image--' + ad.offer.features[i]);
      lodgeFeatures.appendChild(featureItem);
    }

    offerDialog.replaceChild(lodgeElement, dialogPanel);

    userAvatar.setAttribute('src', ad.author.avatar);
  };

  var dialogCloseByEnterHandler = function (evt) {
    if (window.utils.isEnterPressed(evt.keyCode)) {
      dialogCloseHandler();
    }
  };

  var dialogCloseByEscHandler = function (evt) {
    if (window.utils.isEscPressed(evt.keyCode)) {
      dialogCloseHandler();
    }
  };

  var addDialogListeners = function () {
    dialogClose.addEventListener('click', dialogCloseHandler);
    dialogClose.addEventListener('keydown', dialogCloseByEnterHandler);
    document.addEventListener('keydown', dialogCloseByEscHandler);
  };

  var removeDialogListeners = function () {
    dialogClose.removeEventListener('click', dialogCloseHandler);
    dialogClose.removeEventListener('keydown', dialogCloseByEnterHandler);
    document.removeEventListener('keydown', dialogCloseByEscHandler);
  };

  var dialogCloseHandler = function () {
    hideDialog();
    window.pin.deactivate();
  };

  // добавляет попапу класс hidden
  var hideDialog = function () {
    offerDialog.classList.add('hidden');
    removeDialogListeners();
  };

  hideDialog();

  return {
    // убирает у попапа класс hidden
    show: function (ad) {
      offerDialog.classList.remove('hidden');
      addDialogListeners();
      insertAdInformation(ad);
    }
  };
})();

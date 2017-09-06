'use strict';

(function () {
  // переменные для вывода информации на страницу
  var offerDialog = document.querySelector('#offer-dialog');
  var lodgeTemplate = document.querySelector('#lodge-template').content;

  window.card = {
    // выводим информацию об объявлении
    insertAdInformation: function (ad) {
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
      var typesRu = {
        flat: 'Квартира',
        house: 'Дом',
        bungalo: 'Бунгало'
      };

      title.textContent = ad.offer.title;
      address.textContent = ad.offer.address;
      price.textContent = ad.offer.price + ' \u20bd/ночь';
      type.textContent = typesRu[ad.offer.type];
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
    },

    // функция возвращает массив объявлений
    getAdsArray: function (adCount) {
      var adArray = [];

      for (var i = 0; i < adCount; i++) {
        adArray.push(window.data.getAd(i));
      }

      return adArray;
    },
  };
})();

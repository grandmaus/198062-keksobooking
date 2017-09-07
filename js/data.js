'use strict';

window.data = (function () {

  return {
    adParameters: {
      TITLES: [
        'Большая уютная квартира',
        'Маленькая неуютная квартира',
        'Огромный прекрасный дворец',
        'Маленький ужасный дворец',
        'Красивый гостевой домик',
        'Некрасивый негостеприимный домик',
        'Уютное бунгало далеко от моря',
        'Неуютное бунгало по колено в воде'
      ],
      TYPES: [
        'flat',
        'house',
        'bungalo'
      ],
      TIMES: [
        '12:00',
        '13:00',
        '14:00'
      ],
      FEATURES: [
        'wifi',
        'dishwasher',
        'parking',
        'washer',
        'elevator',
        'conditioner'
      ],
      GUESTS_MIN: 1,
      GUESTS_MAX: 100,
      MIN_PRICE: 1000,
      MAX_PRICE: 1000000,
      ROOMS_MIN: 1,
      ROOMS_MAX: 5,
    },
    AD_COUNT: 8,
    LOCATION_X_MIN: 300,
    LOCATION_X_MAX: 900,
    LOCATION_Y_MIN: 160,
    LOCATION_Y_MAX: 500,

    // функция возвращает сгенерированный объект объявления
    getAd: function (index) {
      var avatarNumber = (index + 1);
      // если количество фотографий меньше 10 - добавляю 0 к номеру, если 10 и больше оставляю как есть
      var avatarImage = avatarNumber < 10 ? 'img/avatars/user0' + avatarNumber + '.png' : 'img/avatars/user' + avatarNumber + '.png';
      var locationX = window.utils.getRandomNumber(this.LOCATION_X_MIN, this.LOCATION_X_MAX + 1);
      var locationY = window.utils.getRandomNumber(this.LOCATION_Y_MIN, this.LOCATION_Y_MAX + 1);
      var price = window.utils.getRandomNumber(this.adParameters.MIN_PRICE, this.adParameters.MAX_PRICE + 1);
      var rooms = window.utils.getRandomNumber(this.adParameters.ROOMS_MIN, this.adParameters.ROOMS_MAX + 1);
      var guests = window.utils.getRandomNumber(this.adParameters.GUESTS_MIN, this.adParameters.GUESTS_MAX + 1);
      var featuresAmount = window.utils.getRandomNumber(1, this.adParameters.FEATURES.length + 1);

      var ad = {
        author: {
          avatar: avatarImage
        },
        offer: {
          title: window.utils.getRandomArrayElement(this.adParameters.TITLES),
          address: locationX + ', ' + locationY,
          price: price,
          type: window.utils.getRandomArrayElement(this.adParameters.TYPES),
          rooms: rooms,
          guests: guests,
          checkin: window.utils.getRandomArrayElement(this.adParameters.TIMES),
          checkout: window.utils.getRandomArrayElement(this.adParameters.TIMES),
          features: window.utils.getRandomLengthArray(this.adParameters.FEATURES, featuresAmount, true),
          description: '',
          photos: ''
        },
        location: {
          x: locationX,
          y: locationY
        }
      };

      return ad;
    }
  };
})();

'use strict';

var adParameters = {
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
  AD_COUNT: 8,
  GUESTS_MIN: 1,
  GUESTS_MAX: 100,
  MIN_PRICE: 1000,
  MAX_PRICE: 1000000,
  ROOMS_MIN: 1,
  ROOMS_MAX: 5,
  LOCATION_X_MIN: 300,
  LOCATION_X_MAX: 900,
  LOCATION_Y_MIN: 160,
  LOCATION_Y_MAX: 500,
};

// переменные для вывода информации на страницу
var offerDialog = document.querySelector('#offer-dialog');
var lodgeTemplate = document.querySelector('#lodge-template').content;
var pinsContainer = document.querySelector('.tokyo__pin-map');
var pinTemplate = document.querySelector('.pin');

// функция возвращает случайное целое число
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

// функция возвращает случайный элемент массива. В параметр передаётся массив
var getRandomArrayElement = function (array) {
  var elementIndex = getRandomNumber(0, array.length);
  var element = array[elementIndex];
  return element;
};

// функция для способа сортировки массива
var sortRandom = function () {
  return Math.random() - 0.5;
};

// функция фозвращает массив случайной длины
var getRandomLengthArray = function (array) {
  var randomArray = [];
  var randomLength = getRandomNumber(1, array.length);

  array.sort(sortRandom);

  for (var i = 0; i <= randomLength; i++) {
    randomArray.push(array[i]);
  }
  return randomArray;
};

// функция возвращает сгенерированный объект объявления
var getAd = function () {
  var avatarIndex = getRandomNumber(0, adParameters.TITLES.length);
  var avatarNumber = (avatarIndex + 1);
  // если количество фотографий меньше 10 - добавляю 0 к номеру, если 10 и больше оставляю как есть
  var avatarImage = avatarNumber < 10 ? 'img/avatars/user' + '0' + avatarNumber + '.png' : 'img/avatars/user' + avatarNumber + '.png';
  var locationX = getRandomNumber(adParameters.LOCATION_X_MIN, adParameters.LOCATION_X_MAX + 1);
  var locationY = getRandomNumber(adParameters.LOCATION_Y_MIN, adParameters.LOCATION_Y_MAX + 1);
  var price = getRandomNumber(adParameters.MIN_PRICE, adParameters.MAX_PRICE + 1);
  var rooms = getRandomNumber(adParameters.ROOMS_MIN, adParameters.ROOMS_MAX + 1);
  var guests = getRandomNumber(adParameters.GUESTS_MIN, adParameters.GUESTS_MAX + 1);

  var ad = {
    author: {
      avatar: avatarImage
    },
    offer: {
      title: getRandomArrayElement(adParameters.TITLES),
      address: locationX + ', ' + locationY,
      price: price,
      type: getRandomArrayElement(adParameters.TYPES),
      rooms: rooms,
      guests: guests,
      checkin: getRandomArrayElement(adParameters.TIMES),
      checkout: getRandomArrayElement(adParameters.TIMES),
      features: getRandomLengthArray(adParameters.FEATURES),
      description: '',
      photos: ''
    },
    location: {
      x: locationX,
      y: locationY
    }
  };

  return ad;
};

// функция возвращает массив объявлений
function getAdsArray(adCount) {
  var adArray = [];

  for (var i = 0; i < adCount; i++) {
    adArray.push(getAd());
  }

  return adArray;
}

var renderPin = function (ad) {
  var pinElement = pinTemplate.cloneNode(true);
  // по оси x отнимаем половину ширины, по оси y высоту, чтобы на координату указывал острый конец маркера
  var pinCoordinateX = 'left: ' + (ad.location.x - pinTemplate.clientWidth / 2) + 'px';
  var pinCoordinateY = 'top: ' + (ad.location.y - pinTemplate.clientHeight) + 'px';

  pinElement.setAttribute('style', pinCoordinateX + '; ' + pinCoordinateY);
  pinElement.querySelector('.rounded').setAttribute('src', ad.author.avatar);

  return pinElement;
};

// функция возвращает фрагмент с DOM нодами маркеров
var createPinFragment = function () {
  var fragment = document.createDocumentFragment();
  var randomPin;

  for (var i = 0; i < adParameters.AD_COUNT; i++) {
    randomPin = getAd();
    fragment.appendChild(renderPin(randomPin));
  }

  return fragment;
};

// выводим информацию об объявлении
var insertInformation = function (ad) {
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
};

var adsArray = getAdsArray(adParameters.AD_COUNT);

// вставляем фрагмент с маркерами на страницу
pinsContainer.appendChild(createPinFragment());

insertInformation(adsArray[0]);

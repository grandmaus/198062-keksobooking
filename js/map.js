'use strict';

var ADVERTISEMENT_PARAMETERS = {
  titles: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  types: [
    'flat',
    'house',
    'bungalo'
  ],
  typesRu: {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  },
  times: [
    '12:00',
    '13:00',
    '14:00'
  ],
  features: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ]
};

var ADVERTISEMENT_COUNT = 8;
var GUESTS_MIN = 1;
var GUESTS_MAX = 100;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;
var LOCATION_Y_MIN = 100;
var LOCATION_Y_MAX = 500;

// переменные для вывода информации на страницу
var offerDialog = document.querySelector('#offer-dialog');
var lodgeTemplate = document.querySelector('#lodge-template').content;
var pinsContainer = document.querySelector('.tokyo__pin-map');
var pinTemplate = document.querySelector('.pin');

// функция возвращает случайное целое число
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min));
};

// функция возвращает случайный элемент массива. В параметр передаётся массив
var getRandomArrayElement = function (array) {
  var elementIndex = getRandomNumber(0, array.length);
  var element = array[elementIndex];
  return element;
};

// функция возвращает сгенерированный объект объявления
var getRandomAdvertisement = function () {
  var avatarIndex = getRandomNumber(0, ADVERTISEMENT_PARAMETERS.titles.length);
  var avatarNumber = (avatarIndex + 1);
  var locationX = getRandomNumber(LOCATION_X_MIN, LOCATION_X_MAX + 1);
  var locationY = getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX + 1);
  var price = getRandomNumber(MIN_PRICE, MAX_PRICE + 1);
  var rooms = getRandomNumber(ROOMS_MIN, ROOMS_MAX + 1);
  var guests = getRandomNumber(GUESTS_MIN, GUESTS_MAX + 1);
  // задаю переменные для копирования участка массива методом slice
  // randomFeaturesAmountFrom начало, randomFeaturesAmountTo конец.
  // Они выбираются рандомно.
  var randomFeaturesAmountFrom = getRandomNumber(1, ADVERTISEMENT_PARAMETERS.features.length + 1);
  var randomFeaturesAmountTo = getRandomNumber(1, ADVERTISEMENT_PARAMETERS.features.length + 1);
  var randomFeatures = (randomFeaturesAmountTo > randomFeaturesAmountFrom) ?
    ADVERTISEMENT_PARAMETERS.features.slice(randomFeaturesAmountFrom, randomFeaturesAmountTo + 1) :
    ADVERTISEMENT_PARAMETERS.features.slice(randomFeaturesAmountTo, randomFeaturesAmountFrom + 1);

  var advertisement = {
    author: {
      avatar: 'img/avatars/user' + '0' + avatarNumber + '.png'
    },
    offer: {
      title: getRandomArrayElement(ADVERTISEMENT_PARAMETERS.titles),
      address: locationX + ',' + locationY,
      price: price,
      type: getRandomArrayElement(ADVERTISEMENT_PARAMETERS.types),
      rooms: rooms,
      guests: guests,
      checkin: getRandomArrayElement(ADVERTISEMENT_PARAMETERS.times),
      checkout: getRandomArrayElement(ADVERTISEMENT_PARAMETERS.times),
      features: randomFeatures,
      description: '',
      photos: ''
    },
    location: {
      x: locationX,
      y: locationY
    }
  };

  return advertisement;
};

// функция возвращает массив объявлений
function getAdvertisementsArray(advertisementCount) {
  var advertisementItems = [];

  for (var i = 0; i < advertisementCount; i++) {
    advertisementItems.push(getRandomAdvertisement(i));
  }

  return advertisementItems;
}

var renderPin = function (advertisement) {
  var pinElement = pinTemplate.cloneNode(true);
  // по оси x отнимаем половину ширины, по оси y высоту, чтобы на координату указывал острый конец маркера
  var pinCoordinateX = 'left: ' + (advertisement.location.x - pinTemplate.getAttribute('width') / 2) + 'px';
  var pinCoordinateY = 'top: ' + (advertisement.location.y - pinTemplate.getAttribute('height')) + 'px';

  pinElement.setAttribute('style', pinCoordinateX + '; ' + pinCoordinateY);
  pinElement.querySelector('.rounded').setAttribute('src', advertisement.author.avatar);

  return pinElement;
};

// функция возвращает фрагмент с DOM нодами маркеров
var createPinFragment = function () {
  var fragment = document.createDocumentFragment();
  var randomPin;

  for (var i = 0; i < ADVERTISEMENT_COUNT; i++) {
    randomPin = getRandomAdvertisement();
    fragment.appendChild(renderPin(randomPin));
  }

  return fragment;
};

// вставляем фрагмент с маркерами на страницу
pinsContainer.appendChild(createPinFragment());

// выводим информацию об объявлении
var insertInformation = function (advertisement) {
  var lodgeElement = lodgeTemplate.cloneNode(true);
  var lodgeFeatures = lodgeElement.querySelector('.lodge__features');
  var dialogPanel = offerDialog.querySelector('.dialog__panel');
  var userAvatar = offerDialog.querySelector('.dialog__title > img');

  lodgeElement.querySelector('.lodge__title').textContent = advertisement.offer.title;
  lodgeElement.querySelector('.lodge__address').textContent = advertisement.offer.address;
  lodgeElement.querySelector('.lodge__price').textContent = advertisement.offer.price + ' \u20bd/ночь';
  lodgeElement.querySelector('.lodge__type').textContent = ADVERTISEMENT_PARAMETERS.typesRu[advertisement.offer.type];
  lodgeElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + advertisement.offer.guests + ' гостей в ' + advertisement.offer.rooms + ' комнатах';
  lodgeElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + advertisement.offer.checkin + ', выезд до ' + advertisement.offer.checkout;
  lodgeElement.querySelector('.lodge__description').textContent = advertisement.offer.description;

  for (var i = 0; i < advertisement.offer.features.length; i++) {
    var featureItem = document.createElement('span');
    featureItem.classList.add('feature__image', 'feature__image--' + advertisement.offer.features[i]);
    lodgeFeatures.appendChild(featureItem);
  }

  offerDialog.replaceChild(lodgeElement, dialogPanel);

  userAvatar.setAttribute('src', advertisement.author.avatar);
};

var advertisementsArray = getAdvertisementsArray(ADVERTISEMENT_COUNT);

insertInformation(advertisementsArray[0]);

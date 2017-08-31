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

var keyCodes = {
  ESC: 27,
  ENTER: 13
};

// переменные для вывода информации на страницу
var offerDialog = document.querySelector('#offer-dialog');
var lodgeTemplate = document.querySelector('#lodge-template').content;
var pinsContainer = document.querySelector('.tokyo__pin-map');
var pinTemplate = document.querySelector('#pin-template').content;
var dialogClose = offerDialog.querySelector('.dialog__close');

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


// функция возвращает массив случайной длины с неповторяющимися элементами
var getRandomLengthArray = function (array, length, unique) {
  var randomArray = [];
  var arrayElement;

  while (randomArray.length < length) {
    arrayElement = array[getRandomNumber(0, array.length)];
    if (unique && ~randomArray.indexOf(arrayElement)) {
      continue;
    } else {
      randomArray.push(arrayElement);
    }
  }

  return randomArray;
};

// функция возвращает сгенерированный объект объявления
var getAd = function (index) {
  var avatarNumber = (index + 1);
  // если количество фотографий меньше 10 - добавляю 0 к номеру, если 10 и больше оставляю как есть
  var avatarImage = avatarNumber < 10 ? 'img/avatars/user' + '0' + avatarNumber + '.png' : 'img/avatars/user' + avatarNumber + '.png';
  var locationX = getRandomNumber(adParameters.LOCATION_X_MIN, adParameters.LOCATION_X_MAX + 1);
  var locationY = getRandomNumber(adParameters.LOCATION_Y_MIN, adParameters.LOCATION_Y_MAX + 1);
  var price = getRandomNumber(adParameters.MIN_PRICE, adParameters.MAX_PRICE + 1);
  var rooms = getRandomNumber(adParameters.ROOMS_MIN, adParameters.ROOMS_MAX + 1);
  var guests = getRandomNumber(adParameters.GUESTS_MIN, adParameters.GUESTS_MAX + 1);
  var featuresAmount = getRandomNumber(1, adParameters.FEATURES.length + 1);

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
      features: getRandomLengthArray(adParameters.FEATURES, featuresAmount, true),
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
    adArray.push(getAd(i));
  }

  return adArray;
}

var renderPin = function (ad) {
  var pinFragment = pinTemplate.cloneNode(true);
  var pinElement = pinFragment.querySelector('.pin');
  // размеры метки
  var pinWidth = 56;
  var pinHeight = 75;
  // по оси x отнимаем половину ширины, по оси y высоту, чтобы на координату указывал острый конец маркера
  var pinCoordinateX = 'left: ' + (ad.location.x - pinWidth / 2) + 'px';
  var pinCoordinateY = 'top: ' + (ad.location.y - pinHeight) + 'px';
  // аватарка пина
  var pinImage = pinElement.querySelector('.rounded');

  pinElement.setAttribute('style', pinCoordinateX + '; ' + pinCoordinateY);
  pinImage.setAttribute('src', ad.author.avatar);
  pinElement.setAttribute('tabindex', '0');

  return pinElement;
};

// функция возвращает фрагмент с DOM нодами маркеров
var createPinFragment = function () {
  var fragment = document.createDocumentFragment();

  adsArray.forEach(function (ad) {
    fragment.appendChild(createPin(ad));
  });

  return fragment;
};

// добавляет обработчики на пины
var pinHandlersAdd = function (pin, ad) {
  pin.addEventListener('click', function (evt) {
    pinClickHandler(evt, ad);
  });

  pin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === keyCodes.ENTER) {
      pinClickHandler(evt, ad);
    }
  });
};

var createPin = function (ad) {
  var pin = renderPin(ad);
  pinHandlersAdd(pin, ad);
  return pin;
};

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

// module4

// переменные для событий
var dialog = document.querySelector('#offer-dialog');

// функция деактивирует пин
var deactivatePin = function () {
  var pinActive = document.querySelector('.pin--active');

  if (pinActive) {
    pinActive.classList.remove('pin--active');
  }
};

var dialogEnterCloseHandler = function (evt) {
  if (evt.keyCode === keyCodes.ENTER) {
    dialogCloseHandler();
  }
};

var dialogEscCloseHandler = function (evt) {
  if (evt.keyCode === keyCodes.ESC) {
    dialogCloseHandler();
  }
};

var pinClickHandler = function (evt, ad) {
  deactivatePin();
  insertAdInformation(ad);
  evt.currentTarget.classList.add('pin--active');
  showDialog();
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
  deactivatePin();
};

// добавляет попапу класс hidden
var hideDialog = function () {
  dialog.classList.add('hidden');
  dialogRemoveListeners();
};

// убирает у попапа класс hidden
var showDialog = function () {
  dialog.classList.remove('hidden');
  dialogAddListeners();
};

// добавляю диалогу обработчики закрытия
dialogAddListeners();

// вставляем фрагмент с маркерами на страницу
pinsContainer.appendChild(createPinFragment());

insertAdInformation(adsArray[0]);

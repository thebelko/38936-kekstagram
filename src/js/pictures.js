'use strict';

var LOAD_URL = 'http://localhost:1507/api/pictures?callback=JSONPCallback';

var filtersElement = document.querySelector('.filters');

var loadJSOPData = function(url, callback) {
  var scriptElement = document.createElement('script');
  scriptElement.src = url;
  document.body.appendChild(scriptElement);

  if (typeof callback === 'function') {
    callback();
  }
};

var containerForPhotos = document.querySelector('.pictures');
var template = document.querySelector('#picture-template');
var templateContainer = 'content' in template ? template.content : template;

var IMAGE_LOAD_TIMEOUT = 10000;

var getPictureElement = function(picture) {
  var pictureElement = templateContainer.querySelector('.picture').cloneNode(true);
  pictureElement.querySelector('.picture-comments').textContent = picture.comments;
  pictureElement.querySelector('.picture-likes').textContent = picture.likes;

  var imageElement = pictureElement.querySelector('img');
  var photoImage = new Image(182, 182);
  var photoImageTimeout = null;

  photoImage.onload = function() {
    clearTimeout(photoImageTimeout);
    imageElement.src = picture.url;
  };

  photoImage.onerror = function() {
    clearTimeout(photoImageTimeout);
    imageElement.classList.add('picture-load-failure');
  };

  photoImage.src = picture.url;

  photoImageTimeout = setTimeout(function() {
    imageElement.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);

  return pictureElement;
};

var renderPictures = function(pictures) {
  pictures.forEach(function(picture) {
    containerForPhotos.appendChild(getPictureElement(picture));
  });

  filtersElement.classList.remove('hidden');
};

var loadPicturesOnPage = function() {
  window.JSONPCallback = function(data) {
    var pictures = data;
    renderPictures(pictures);
  };
};

filtersElement.classList.add('hidden');
loadJSOPData(LOAD_URL, loadPicturesOnPage);

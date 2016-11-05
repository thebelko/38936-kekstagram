'use strict';

var loadJSOPData = require('./load');
var getPictureElement = require('./picture');
var galleryBlock = require('./gallery');

var LOAD_URL = 'http://localhost:1507/api/pictures';
var containerForPhotos = document.querySelector('.pictures');
var filtersElement = document.querySelector('.filters');

module.exports = function() {
  filtersElement.classList.add('hidden');

  loadJSOPData(LOAD_URL, function(picturesArray) {
    picturesArray.forEach(function(picture, pictureIndex) {
      containerForPhotos.appendChild(getPictureElement(picture, pictureIndex));
    });
    filtersElement.classList.remove('hidden');
    galleryBlock.setPictures(picturesArray);
  }
  );
};

'use strict';

var loadJSOPData = require('./load');
var Picture = require('./picture');
var galleryBlock = require('./gallery');

var LOAD_URL = 'http://localhost:1507/api/pictures';
var containerForPhotos = document.querySelector('.pictures');
var filtersElement = document.querySelector('.filters');

module.exports = function() {
  filtersElement.classList.add('hidden');

  loadJSOPData(LOAD_URL, function(picturesArray) {
    picturesArray.forEach(function(picture, pictureIndex) {
      var pictureElement = new Picture(picture, pictureIndex);
      containerForPhotos.appendChild(pictureElement.element);
    });
    filtersElement.classList.remove('hidden');
    galleryBlock.setPictures(picturesArray);
  }
  );
};

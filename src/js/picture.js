'use strict';

var galleryBlock = require('./gallery');

var template = document.querySelector('#picture-template');
var templateContainer = 'content' in template ? template.content : template;

var IMAGE_LOAD_TIMEOUT = 10000;

var Picture = function(picture, pictureIndex) {
  this.data = picture;
  this.element = this.getPictureElement(picture, pictureIndex);

  this.element.onclick = function() {
    event.preventDefault();
    galleryBlock.show(pictureIndex);
  };

  this.remove = function() {
    this.element.onclick = null;
  };
};

Picture.prototype.getPictureElement = function(picture) {
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

module.exports = Picture;

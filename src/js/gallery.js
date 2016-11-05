'use strict';

var Gallery = function() {
  this.galleryElement = document.querySelector('.gallery-overlay');
  this.galleryCloseElement = this.galleryElement.querySelector('.gallery-overlay-close');
  this.galleryActivePicture = this.galleryElement.querySelector('.gallery-overlay-image');
  this.pictures = [];
  this.activePicture = 0;
};

Gallery.prototype.setPictures = function(data) {
  this.pictures = data;
};

Gallery.prototype.setActivePicture = function(pictureIndex) {
  this.activePicture = pictureIndex;
  this.galleryActivePicture.src = this.pictures[pictureIndex].url;
  this.galleryElement.querySelector('.comments-count').textContent = this.pictures[pictureIndex].comments;
  this.galleryElement.querySelector('.likes-count').textContent = this.pictures[pictureIndex].likes;
};

Gallery.prototype.show = function(pictureIndex) {
  this.galleryElement.classList.remove('invisible');

  this.setActivePicture(pictureIndex);

  var self = this;

  this.galleryCloseElement.onclick = function() {
    self.hide();
  };
  this.galleryActivePicture.onclick = function() {
    if(self.activePicture === self.pictures.length - 1) {
      self.setActivePicture(0);
    } else {
      self.setActivePicture(self.activePicture + 1);
    }
  };
};

Gallery.prototype.hide = function() {
  this.galleryElement.classList.add('invisible');
  this.galleryCloseElement.onclick = null;
  this.galleryActivePicture.onclick = null;
};

module.exports = new Gallery();

'use strict';

var Gallery = function(data) {
  this.galleryElement = document.querySelector('.gallery-overlay');
  this.galleryCloseElement = this.galleryElement.querySelector('.gallery-overlay-close');
  this.galleryActivePicture = this.galleryElement.querySelector('.gallery-overlay-image');
  this.pictures = [];
  this.activePicture = 0;
};

Gallery.prototype.setPictures = function(data) {
  this.pictures = data;
};


Gallery.prototype.setActivePicture = function(number) {
  this.activePicture = number;
  this.galleryActivePicture.src = this.pictures[number].url;
  this.galleryElement.querySelector('.comments-count').textContent = this.pictures[number].comments;
  this.galleryElement.querySelector('.likes-count').textContent = this.pictures[number].likes;
};


Gallery.prototype.show = function(number) {
  this.galleryElement.classList.remove('invisible');

  this.setActivePicture(number);

  var self = this;

  this.galleryCloseElement.onclick = function() {
    self.hide();
  };
  this.galleryActivePicture.onclick = function() {
    if(number === self.pictures[self.pictures.length - 1]) {
      self.setActivePicture(self.pictures[0])
    } else {
      self.setActivePicture(self.pictures[number+1])
    }
  }
};

Gallery.prototype.hide = function() {
  this.galleryElement.classList.add('invisible');
  this.galleryCloseElement.onclick = null;
  this.galleryActivePicture.onclick = null;
};

module.exports = new Gallery();

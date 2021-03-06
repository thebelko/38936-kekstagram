'use strict';

var getMessage = function(a, b) {
  var typeOfA = typeof a;
  var typeOfAIsArray = Array.isArray(a);
  var typeOfBIsArray = Array.isArray(b);

  function getArraySum(arrayName) {
    var amount = 0;
    for (var i = 0; i < arrayName.length; i++) {
      amount += arrayName[i];
    }
    return amount;
  }

  function getTwoArraysMultiplication(arrayFirst, arraySecond) {
    var subsidiaryArray = [];
    for (var i = 0; i < arrayFirst.length; i++) {
      subsidiaryArray.push(arrayFirst[i] * arraySecond[i]);
    }
    return subsidiaryArray;
  }

  if (typeOfA === 'boolean') {
    if (a === false) {
      return 'Переданное GIF-изображение не анимировано';
    } else {
      return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
    }
  } else if (typeOfA === 'number') {
    return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + b * 4 + ' атрибутов';
  } else if (typeOfAIsArray && !typeOfBIsArray) {
    return 'Количество красных точек во всех строчках изображения: ' + getArraySum(a);
  } else if (typeOfAIsArray && typeOfBIsArray) {
    return 'Общая площадь артефактов сжатия: ' + getArraySum(getTwoArraysMultiplication(a, b)) + ' пикселей';
  } else {
    return 'Переданы некорректные данные';
  }
};

window.getMessage = getMessage;

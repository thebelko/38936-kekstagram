var getMessage = function (a, b) {
  var typeOfA = typeof a;
  var typeOfAIsMassive = Array.isArray(a);
  var typeOfBIsMassive = Array.isArray(b);

  if (typeOfA === "boolean") {
    if (a === false) {
      return "Переданное GIF-изображение не анимировано";
    } else {
      return "Переданное GIF-изображение анимировано и содержит " + b + " кадров";
    }
  } else if (typeOfA === "number") {
      return "Переданное SVG-изображение содержит " + a + " объектов и " + b * 4 + " атрибутов";
  } else if (typeOfAIsMassive && !typeOfBIsMassive) {
    function getArraySum(a) {
      var amountOfRedPoints = 0;
      for (var i = 0; i < a.length; i++) {
        amountOfRedPoints += a[i];
      }
      return amountOfRedPoints;
    }
    return "Количество красных точек во всех строчках изображения: " +  getArraySum(a);
  } else if (typeOfAIsMassive && typeOfBIsMassive) {
    var subsidiaryArray = [];
    function getTwoArraysMultiplication(a, b) {
      for (var i=0; i<a.length; i++) {
        subsidiaryArray.push(a[i]*b[i]);
      }
      return subsidiaryArray;
    }

    getTwoArraysMultiplication(a, b);

    function getArraySum(subsidiaryArray) {
      var artifactsSquare = 0;
      for (var i = 0; i < subsidiaryArray.length; i++) {
        artifactsSquare += subsidiaryArray[i];
      }
      return artifactsSquare;
    }
    return "Общая площадь артефактов сжатия: " + getArraySum(subsidiaryArray) + " пикселей";
  } else {
    return "Переданы некорректные данные";
  }
};

var getMessage = function (a, b) {
  var typeOfA = typeof a;
  var typeOfAMassive = Array.isArray(a);
  var typeOfBMassive = Array.isArray(b);

  if (typeOfA === "boolean") {
    if (a === false) {
      return "Переданное GIF-изображение не анимировано";
    } else {
      return "Переданное GIF-изображение анимировано и содержит " + b + " кадров";
    }
  }

  else if (typeOfA === "number"){
      return "Переданное SVG-изображение содержит " + a + " объектов и " + b*4 + " атрибутов";
  }

  else if (typeOfAMassive && !typeOfBMassive) {
    function getArraySum(typeOFAMassive){
      var amountOfRedPoints = 0;
      for(var i = 0; i < typeOFAMassive.length; i++){
        amountOfRedPoints += typeOFAMassive[i];
      }
      return amountOfRedPoints;
    }
    return "Количество красных точек во всех строчках изображения: " +  getArraySum(a);
  }

  else if (typeOfAMassive && typeOfBMassive) {
    var subsidiaryArray = [];
    function getTwoArraysMultiplication(typeOfAMassive, typeOfBMassive) {
      for(var i=0; i<typeOfAMassive.length; i++) {
        subsidiaryArray.push(typeOfAMassive[i]*typeOfBMassive[i]);
      }
      return subsidiaryArray;
    }

    getTwoArraysMultiplication(a, b);

    function getArraySum(subsidiaryArray){
      var artifactsSquare = 0;
      for(var i = 0; i < subsidiaryArray.length; i++){
        artifactsSquare += subsidiaryArray[i];
      }
      return artifactsSquare;
    }
    return "Общая площадь артефактов сжатия: " + getArraySum(subsidiaryArray) + " пикселей";
  }

  else {
    return "Переданы некорректные данные";
  }

};

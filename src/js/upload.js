/* global Resizer: true */
/* global Cookies */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

module.exports = (function() {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  var cleanupResizer = function() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  };

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  var updateBackground = function() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  };

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  var coordinateXElement = document.getElementById('resize-x');
  var coordinateYElement = document.getElementById('resize-y');
  var resizeWidthElement = document.getElementById('resize-size');

  var submitButton = document.getElementById('resize-fwd');

  var setNewImageConstraint = function() {
    var coordinateXValue = coordinateXElement.value;
    var coordinateYValue = coordinateYElement.value;
    var resizeWidthValue = resizeWidthElement.value;

    var coordinateX = +coordinateXElement.value;
    var coordinateY = +coordinateYElement.value;
    var resizeWidth = +resizeWidthElement.value;

    var uploadImageWidth = currentResizer._image.naturalWidth;
    var uploadImageHeight = currentResizer._image.naturalHeight;

    resizeWidthElement.min = 25;

    if (uploadImageWidth <= coordinateX + resizeWidth) {
      return false;
    }

    if (uploadImageHeight < coordinateY + resizeWidth) {
      return false;
    }

    if (coordinateX < 0 || coordinateY < 0 || resizeWidth < 0) {
      return false;
    }

    if (coordinateXValue === '' || coordinateYValue === '' || resizeWidthValue === '') {
      return false;
    }

    return true;
  };

  var resizeFormIsValid = function() {

    if (setNewImageConstraint()) {
      submitButton.removeAttribute('disabled');
      return true;
    } else {
      submitButton.setAttribute('disabled', 'disabled');
      return false;
    }
  };

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  var showMessage = function(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  };

  var hideMessage = function() {
    uploadMessage.classList.add('invisible');
  };

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.onchange = function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.onload = function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          coordinateXElement.value = 0;
          coordinateYElement.value = 0;
          resizeWidthElement.value = 150;

          hideMessage();

          resizeFormIsValid();
        };

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если формат загружаемого файла не поддерживается
        showMessage(Action.ERROR);
      }
    }
  };

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.onreset = function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      var image = currentResizer.exportImage().src;

      var thumbnails = filterForm.querySelectorAll('.upload-filter-preview');
      for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].style.backgroundImage = 'url(' + image + ')';
      }

      filterImage.src = image;

      var filterFromCookie = Cookies.get('upload-filter');
      filterImage.classList.add(filterFromCookie);
      document.getElementById('upload-' + filterFromCookie).setAttribute('checked', 'checked');

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  };
  coordinateXElement.oninput = function() {
    resizeFormIsValid();
  };

  coordinateYElement.oninput = function() {
    resizeFormIsValid();
  };

  resizeWidthElement.oninput = function() {
    resizeFormIsValid();
  };

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.onreset = function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  };

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */

  filterForm.onsubmit = function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');

  };

  var nowDate = new Date();
  var dateOfBirth = new Date('2016-12-09');

  var nowDay = nowDate.getDate();
  var nowMonth = nowDate.getMonth();

  var countDateOfBirth = function() {
    if (nowMonth === dateOfBirth.getMonth()) {
      if (nowDay > dateOfBirth.getDate()) {
        dateOfBirth.setFullYear(nowDate.getFullYear());
        return dateOfBirth;
      } else {
        dateOfBirth.setFullYear(nowDate.getFullYear() - 1);
        return dateOfBirth;
      }
    } else {
      dateOfBirth.setFullYear(nowDate.getFullYear() - 1);
      return dateOfBirth;
    }
  };

  countDateOfBirth();

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.onchange = function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia',
        'marvin': 'filter-marvin'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];

    var intervalBetweenDates = Math.round((nowDate - dateOfBirth) / (24 * 60 * 60 * 1000));
    Cookies.set('upload-filter', filterMap[selectedFilter], { expires: intervalBetweenDates });
  };

  cleanupResizer();
  updateBackground();
})();



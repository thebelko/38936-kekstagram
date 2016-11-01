'use strict';

module.exports = function loadJSOPData(url, callback) {
  var callbackName = 'cb' + Date.now();

  window[callbackName] = function(data) {
    callback(data);
    delete window[callbackName];
  };

  var scriptElement = document.createElement('script');
  scriptElement.src = url + '?callback=' + callbackName;
  document.body.appendChild(scriptElement);
};


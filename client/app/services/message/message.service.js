'use strict';

angular.module('ictsAppApp')
.factory('message', ['$timeout', ($timeout) => {

  const translate = {
    danger: 'Fout!',
    warning: 'Let op!',
    success: 'Gelukt!',
    info: 'Info!'
  };

  function message(type, text, time) {
    let container = document.getElementById('message-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'message-container';
      document.body.appendChild(container);
    }

    const div = document.createElement('div');
    const html =
    `<div class="alert alert-${type}">
      <strong>${translate[type]}</strong> ${text}
    </div>`;

    div.innerHTML = html;
    const message = div.firstChild;
    container.appendChild(message);

    $timeout(() => message.parentNode.removeChild(message), time);
  }

  return {
    success: (msg) => message('success', msg, 3000),
    warning: (msg) => message('warning', msg, 3000),
    error: (msg) => message('danger',  msg, 30000),
    info: (msg) => message('info', msg, 3000),
  };
}]);

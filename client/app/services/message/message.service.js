'use strict';

angular.module('ictsAppApp')
.factory('message', ($timeout) => {

  const translate = {
    danger: 'Fout!',
    warning: 'Let op!',
    success: 'Gelukt!',
    info: 'Info!'
  };

  function message(type, text) {
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

    $timeout(() => message.parentNode.removeChild(message), 3000);
  }

  return {
    success: (msg) => message('success', msg),
    warning: (msg) => message('warning', msg),
    error: (msg) => message('danger',  msg),
    info: (msg) => message('info', msg),
  };
});

/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/calls', require('./api/calls'));
  app.use('/api/hvd', require('./api/hvd'));
  app.use('/api/documents', require('./api/document'));
  app.use('/api/mobile_spec', require('./api/mobile_spec'));
  app.use('/api/mail_spec', require('./api/mail_spec'));
  app.use('/api/month_status', require('./api/month_status'));
  app.use('/api/landline_spec', require('./api/landline_spec'));
  app.use('/api/stats', require('./api/stats'));
  app.use('/api/kpn', require('./api/kpn'));
  app.use('/api/t_mobile', require('./api/t_mobile'));
  app.use('/api/specifications', require('./api/specification'));
  app.use('/api/departments', require('./api/department'));
  app.use('/api/customers', require('./api/customer'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};

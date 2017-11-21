/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

// var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Customer = require('../api/customer/customer.model');
var Department = require('../api/department/department.model');
var Specification = require('../api/specification/specification.model');
var Kpn = require('../api/kpn/kpn.model');
var TMobile = require('../api/t_mobile/t_mobile.model');
var MonthStatus = require('../api/month_status/month_status.model');
var Attachment = require('../api/mobile_spec/mobile_spec.model');

// Clear all customers
// Customer.find({}).remove(function() {
// 	console.log('Cleaned all customers');
// });


// Clear all specifications
// Specification.find({}).remove(function() {
// 	console.log('Cleaned all specifications');	
// });

// Clear all departments
// Department.find({}).remove(function() {
// 	console.log('Cleaned all departments');
// });

// Clear all kpn records
// Kpn.find({}).remove(function() {
// 	console.log('Cleaned all KPN records');
// });

// Clear all Attachment records
// Attachment.find({}).remove(function() {
// 	console.log('Cleaned all Attachment records');
// });

// Clear all TMobile
// TMobile.find({}).remove(function() {
// 	console.log('Cleaned all TMobile records');
// });

// Clear all month status
// MonthStatus.find({}).remove(function() {
// 	console.log('Cleaned all month status');
// });

// Thing.find({}).remove(function() {
//   Thing.create({
//     name : 'Development Tools',
//     info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
//   }, {
//     name : 'Server and Client integration',
//     info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
//   }, {
//     name : 'Smart Build System',
//     info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
//   },  {
//     name : 'Modular Structure',
//     info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
//   },  {
//     name : 'Optimized Build',
//     info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
//   },{
//     name : 'Deployment Ready',
//     info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
//   });
// });

// User.find({}).remove(function() {
//   User.create({
//     provider: 'local',
//     name: 'Test User',
//     email: 'test@test.com',
//     password: 'test'
//   }, {
//     provider: 'local',
//     role: 'admin',
//     name: 'Admin',
//     email: 'admin@admin.com',
//     password: 'admin'
//   }, function() {
//       console.log('finished populating users');
//     }
//   );
// });
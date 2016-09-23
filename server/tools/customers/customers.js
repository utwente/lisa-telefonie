'use strict';

var Customer = require('../../api/customer/customer.model');
var Department = require('../../api/department/department.model');
var _ = require('lodash');


module.exports.updateSocket = function() { return false; }; // start with an empty function

module.exports = function Customers() {

    var socketEvent = 'customer';
    var customers;      // --> can be used from the whole Customers class.
    var departments;

    // load the customers from database
    this.load = function(callback) {
        Customer.find({}).where('active').equals(true).exec(function (err, cust) {
            if (err) { callback(true); }
            customers = cust;
            Department.find({}, { _id: 0 }).where('active').equals(true).select('_id name email').exec(function (err, dep) {
                if(err) { callback(true); }
                departments = dep;
                console.log(departments);
                callback(false);
            });
        });
    }

    // find the department of the customer by number
    this.findDepartmentByNumber = function(number) {

        if (customers.length === 0) {
            module.exports.updateSocket(socketEvent, {code: 'NO_CUSTOMER_DATA', number: number});
            return {code: 'NO_CUSTOMER_DATA', number: number};
        }

        if (departments.length === 0) {
            module.exports.updateSocket(socketEvent, {code: 'NO_DEPARTMENT_DATA', number: number});
            return {code: 'NO_DEPARTMENT_DATA', number: number}; 
        }

        if (number.slice(0,3) === '053') {
            return {code: 'LANDLINE', number: number};
        }

        var user = _.find(customers, { 'mobileNumber': number });

        if (typeof(user) === 'undefined') {
            module.exports.updateSocket(socketEvent, {code: 'UNKNOWN_NUMBER', number: number})
            return {code: 'UNKNOWN_NUMBER', number: number};
        }

        if (typeof(user.department) === 'undefined') {
            module.exports.updateSocket(socketEvent, {code: 'NO_DEPARTMENT', number: number, name: user.name})
            return {code: 'NO_DEPARTMENT', number: number};
        }

        var dep = _.find(departments, {name: user.department});
        
        if (typeof(user.name) === 'undefined') {
            module.exports.updateSocket(socketEvent, {code: 'NO_NAME', number: number})
            return {code: 'NO_NAME', number: number, department: user.department};
        }


        if (typeof(dep) === 'undefined') {
            module.exports.updateSocket(socketEvent, {code: 'UNKNOWN_DEPARTMENT', number: number, name: user.name, department: user.department})
            return {code: 'UNKNOWN_DEPARTMENT', number: number};
        }

        return {code: "SUCCESS", department: user.department};
    
    }

    this.findUserByNumber = function(number) {
        var user = _.find(customers, {mobileNumber: number});
        return user;
    }

    this.findDepartmentByName = function(name) {
        var dep = _.find(departments, {name: name})
        return dep;
    } 


}

module.exports.error = function(callback) {
    module.exports.updateSocket = callback;                 // this function is called when there is an error.
}
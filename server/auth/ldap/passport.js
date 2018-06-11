var passport = require('passport');
var LdapStrategy = require('passport-ldapauth').Strategy;

exports.setup = function (User, config) {
  passport.use(new LdapStrategy(config.LDAP_OPTIONS));
};
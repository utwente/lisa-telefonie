var fs = require('graceful-fs');
var _ = require('lodash');
var Handlebars = require('handlebars');

module.exports.updateSocket = function(){}; // start with an empty function

module.exports = function HTMLGenerator(callback) {

    var buf = fs.readFileSync(__templates + 'personal_spec.hbs','utf8')
    var mailTemplate = Handlebars.compile(buf);

    Handlebars.registerHelper('formatEuro', function(data){
        return new Handlebars.SafeString('&euro; ' + (Math.round(data)/100).toFixed(2).replace('.',','));
    });


    this.generate = function(filename, user, category, total, totalToDo) {

        // sort by costs
        var data = _.sortBy(category, function(o){
          return o.costs;
        });

        fs.writeFile(filename, mailTemplate({category: category, user: user, total: total}), function(){
            module.exports.updateSocket('mob_html', {msg: 'html done!', total: totalToDo});
        });

    }

};

module.exports.done = function(callback) {
    module.exports.updateSocket = callback; // this function is called when a mail is send.
}

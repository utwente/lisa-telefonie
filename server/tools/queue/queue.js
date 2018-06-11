'use strict';

var _ = require('lodash');

module.exports = function Queue(config) {

    // error if no arguments given
    if (!config) {
        throw new Error('No config variable given.');
    }

    // config.send() is needed.
    if (!config.send) {
        throw new Error('Config variable should contain a config.send() function');
    }

    // set to default if not present
    if (!config.max_attemps) {
        config.max_attemps = 3;
    }

    // if there is no update function in config, create an empty function.
    if (!config.update) {
        config.update = function(){}
    }

    // if no delay factor in config, take 2 as default.
    if (!config.delay_factor) {
        config.delay_factor = 2;
    }

    var queue = [];
    var total = 0;

    this.add = function(msg) {
        var m = new Message(msg);
        queue.push(m);
        m.send();
    }

    function Message(msg) {

        this.message = msg;
        this.attempt = 1;

        total++;

        this.send = function(){
            var self = this;
            config.send(this.message, function(error){
                if (error) {self.retry()}
                else {self.done()}
            });
        };

        this.done = function() {
            var i = queue.indexOf(this);
            queue.splice(i, 1);
            config.update({done: total-queue.length, total: total});
        }

        this.retry = function() {
            var i = queue.indexOf(this);
            this.attempt++;
            queue.splice(i, 1);
            // stop trying to send when max_attemps is exceeded
            if (this.attempt > config.max_attempts){
                config.error('Max attempts exceeded.. (max_attempts = ' + config.max_attempts + ')');
                return;
            }

            queue.push(this);
            var self = this;
            setTimeout(function(){
                self.send();
                self.attempt++;
            }, ((this.attempt - 1)*config.delay_factor*1000));

        }
    }
}

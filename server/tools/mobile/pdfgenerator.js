/*

    title: The title of the PDF document,
    data: array with [{category: category1, costs: costs1}, ...] as shoud be printed on the PDF

*/

var PDFDocument = require('pdfkit');
var fs = require('graceful-fs');
var _ = require('lodash');
var path = require('path');

module.exports.updateSocket = function(){}; // start with an empty function

module.exports = function PDFGenerator() {

    this.generate = function(filename, title, data, total) {

        var values = data.values;
        var categories = data.keys;

        // sort from high costs to low costs.
        values = _.sortBy(values, function(o){
          return - o.costs;
        });

        var colls = _.size(categories);
        var captions = [];
        var keys = [];

        for (key in categories) {
            captions.push(categories[key]);
            keys.push(key);
        }

        var margin = 50;
        var width = 612;
        var startcol2 = 110;

        var doc = new PDFDocument({margin: margin});
        var stream = doc.pipe(fs.createWriteStream(filename));

        var appDir = path.dirname(require.main.filename);

        doc.image(appDir + '/../data/img/header.png', margin, margin, {width: 120});
        
        doc.fontSize(20);
        doc.fillColor('#5F5F5F');
        doc.text(title, margin + 100 + 20, margin + 13, {align: 'right'});
        
        doc.fontSize(13);

        doc.text(captions[0], margin, 120);
        doc.moveUp();
        if (colls === 3) {
            doc.x = margin + startcol2;
            doc.text(captions[1]);
            doc.moveUp();
        }
        doc.text(captions[captions.length - 1], {align: 'right'});
        
        doc.moveTo(margin - 5, 138);
        doc.lineTo(width - margin + 5, 138);
        doc.stroke('#5F5F5F');

        doc.fillColor('black');
        doc.text(' ', margin, 140);

        totalCosts = 0;
        for (var i = 0; i < values.length; i++) {
            if (values[i].costs !== 0) {
                doc.x = margin;
                doc.text(values[i][keys[0]], {align: 'left'});
                doc.moveUp();
                if (colls === 3) {
                    doc.x = margin + startcol2;
                    doc.text(values[i][keys[1]], {continued: true});
                }
                doc.text(('€ ' + (values[i].costs/100).toFixed(2)).replace('.',','), {lineGap: 10, continued: false, align: 'right'});
                totalCosts = totalCosts + values[i].costs;
            }
        }

        doc.x = doc.x + 10;
        doc.y = doc.y + 10;

        doc.moveTo(width - margin + 5 - 70, doc.y - 7);
        doc.lineTo(width - margin + 5, doc.y - 7);
        doc.stroke('#5F5F5F');  

        doc.text(('€ ' + (totalCosts/100).toFixed(2)).replace('.',','), {continued: false, align: 'right'});

        doc.end();
        stream.on('finish', function() {
            module.exports.updateSocket('mob_pdf', {msg: 'pdf done!', total: total});
        });

    }
};

module.exports.done = function(callback) {
    module.exports.updateSocket = callback; // this function is called when a mail is send.
}
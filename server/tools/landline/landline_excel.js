'use strict';

/*

    filename: The filename of the xlsx document,
    data: array with [
        {
            name: "name of person" (String),
            number: "phonenumber" (String),
            totalCosts: "total costs of person" (Integer),
            data: [
                category: "category" (String),
                costs: "costs in that category" (Integer)
            ]
        }
    ]

*/

var Excel = require("exceljs");
var fs = require('graceful-fs');        // this should prevent too many open files error. <- it doesn't...
var _ = require('lodash');

module.exports.updateSocket = function(){return false;}; // start with an empty function

module.exports = function XLSXLLGenerator() {

    this.generate = function(number, path, data, socketEvent, total, callback) {

        // if no callback function, replace it with an empty function
        if (typeof callback === "undefined") {
            callback = function(){};
        }

        var filename = 'Specificatie ' + number + '.xlsx'
        // remove file if it exists (else it does some funny stuff)
        try {
            fs.unlinkSync(path + filename);
        } catch(e) {
            console.log('file does not yet exist')
        }

        // construct a streaming XLSX workbook writer with styles and shared strings
        var options = {
            filename: path + filename,
            useStyles: true,
            useSharedStrings: true
        };

        var workbook = new Excel.stream.xlsx.WorkbookWriter(options);

        workbook.creator = "ICTS Utwente";
        workbook.created = new Date();

        var sheet = workbook.addWorksheet("Bellen");
        var worksheet = workbook.getWorksheet("Bellen");

        var columns = [
            {header: 'Bestemming',    key: 'to',      width: 20},
            {header: 'Datum',         key: 'date',    width: 13},
            {header: 'Tijd',          key: 'start',   width: 10},
            {header: 'Soort gesprek', key: 'type',    width: 30},
            {header: 'Land',          key: 'country', width: 25},
            {header: 'Gespreksduur',  key: 'time',    width: 14},
            {header: 'Kosten',        key: 'costs',   width: 10},
        ];

        worksheet.columns = columns;

        // format the costs
        worksheet.getColumn('G').numFmt = "€ 0.00";

        // style the first row
        for (var col = 1; col < columns.length + 1; col++) {
            worksheet.getCell(this.getCellName(1,col)).border = {bottom: {style: 'thin'}};
            worksheet.getCell(this.getCellName(1,col)).fill = {type: "pattern", pattern: "solid", fgColor: {argb:"FFCCCCCC"}};
        }

        // add the actual data
        if (!data.empty) {
            for (var i = 0; i < data.calls.length; i++) {
                var rowData = {};
                rowData = {
                    to: data.calls[i].bestemming,
                    date: data.calls[i].datum,
                    start: data.calls[i].starttijd,
                    type: data.calls[i].type,
                    country: data.calls[i].vanuit,
                    time: data.calls[i].duur,
                    costs: data.calls[i].kosten/100
                };
                worksheet.addRow(rowData).commit();
            }
        }

        worksheet.commit();
        workbook.commit().then(function(){
            callback()
            if (socketEvent !== 'none'){
                module.exports.updateSocket(socketEvent, {err: false, msg: 'excel generated', number: number , total: total});
            }
        });


    }

    this.getCellName = function(row,col) {
        return String.fromCharCode(65 + col - 1) + row;
    }


};

module.exports.done = function(callback) {
    module.exports.updateSocket = callback; // this function is called when a mail is send.
}

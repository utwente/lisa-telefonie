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
var fs = require('graceful-fs');        // this should prevent too many open files error.
var _ = require('lodash');

module.exports.updateSocket = function(){}; // start with an empty function

module.exports = function XLSXGenerator() {


    this.generate = function(filename, data, total) {

        var categories = [];
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].data.length; j++) {
                if ((data[i].data[j].costs !== 0) && (_.indexOf(categories, data[i].data[j].category) === -1)) {
                    categories.push(data[i].data[j].category);
                }
            };
        };


        // construct a streaming XLSX workbook writer with styles and shared strings
        var options = {
            filename: filename,
            useStyles: true,
            useSharedStrings: true
        };
        var workbook = new Excel.stream.xlsx.WorkbookWriter(options);

        workbook.creator = "UTwente";
        workbook.created = new Date();

        var sheet = workbook.addWorksheet("Telefonie kosten");
        var worksheet = workbook.getWorksheet("Telefonie kosten");

        var columns = [
            {header: 'Naam', key: 'name', width: 30},
            {header: 'Nummer', key: 'number', width: 13},
            {header: 'Totale kosten', key: 'totalCosts', width: 20}
        ];
        for (var i = 0; i < categories.length; i++) {
            columns.push({header: categories[i], key: categories[i], width: 20});
        };

        worksheet.columns = columns;

        // style the first row
        for (var col = 1; col < categories.length + 4; col++) {
            worksheet.getCell(getCellName(1,col)).border = {bottom: {style: 'thin'}};
            worksheet.getCell(getCellName(1,col)).alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell(getCellName(1,col)).fill = {type: "pattern", pattern: "solid", fgColor: {argb:"FFCCCCCC"}};
            worksheet.getColumn(getColName(col)).numFmt = "€ 0.00";

        };


        for (var i = 0; i < data.length; i++) {
            var rowData = {};
            rowData = {
                name: data[i].name,
                number: data[i].number,
                totalCosts: data[i].totalCosts / 100
            };

            for (var j = 0; j < data[i].data.length; j++) {
                if (data[i].data[j].costs !== 0) {
                    rowData[data[i].data[j].category] = data[i].data[j].costs / 100;
                }
            } 
            worksheet.addRow(rowData).commit();
        };

        worksheet.commit();
        workbook.commit()
            .then(function(){
                module.exports.updateSocket('mob_excel', {msg: 'excel done!', total: total});
            });


    }

    function getCellName(row,col) {
        return String.fromCharCode(65 + col - 1) + row;
    }

    function getColName(col) {
        return String.fromCharCode(65 + col - 1);
    }

};

module.exports.done = function(callback) {
    module.exports.updateSocket = callback; // this function is called when a mail is send.
}
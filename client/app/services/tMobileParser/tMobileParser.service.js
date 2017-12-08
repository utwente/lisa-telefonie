/*jshint camelcase: false */
/*global Papa */
'use strict';

angular.module('ictsAppApp')
  .factory('tMobileParser', function () {

    // Public API here
    return {
      parse: function (fileContent) {
        // --------------------------------------
        //   FILE READING AND CSV PARSING STUFF
        // --------------------------------------

        fileContent = fileContent.replace(/\",\"/g, ';');
        fileContent = fileContent.replace(/\"/g, '');
        var lines = fileContent.split('\n');
        if (lines[1].indexOf('Groep;Naam;MSISDN;Specificatie;Datum;Starttijd;Type;Bestemming;Land/Netwerk;Duur/Volume;Uit bundel*;Kosten;') === -1) {
          console.log('no valid t-mobile file..');
          return;
        }
        var parsedDate = lines[0].match(/\d{2}\.\d{2}\.\d{2}/)[0].split('\.');
        var month = new Date('20' + parsedDate[2], parseInt(parsedDate[1]) - 1 - 1);

        lines.splice(0,2);
        lines.splice(lines.length - 2, 2);
        var csv = lines.join('\n');


        var csvContent = Papa.parse(csv, {delimiter: ';'});

        // --------------------------------------
        //   CALCULATE COSTS PER PHONE NUMBER
        // --------------------------------------

        var t_mobile = {
          month: month,
          summary: {
            totalTime: 0,
            totalSMS: 0,
            totalKB: 0,
            totalCosts: 0,
            perType: {}
          },
          numberObject: {}
        };
        var call;
        var key;
        var number;
        var costs;
        var time;
        var type;

        for (var i = csvContent.data.length - 1; i >= 0; i--) {


          call = csvContent.data[i];  // complete call data
          number = call[2];           // phone number
          key = call[3].toCamel();    // type of call
          type = call[6];             // type of communication (landline/mobile/sms/data)

          if (call[8] === '') {
            call[8] = 'Nederland';    // if country where the call is from is not defined, it is from the Netherlands.
          }

          // if phone number does not exist, create it
          if (t_mobile.numberObject[number] === undefined) {
            t_mobile.numberObject[number] = {
              summary: {
                perType: {},
                totalCosts: 0,
                totalTime: 0
              },
              calls: {},
              data: {},
            };
          }

          // if type of "call" does not exist, create it.
          if (t_mobile.numberObject[number].summary.perType[key] === undefined) {
            t_mobile.numberObject[number].summary.perType[key] = {
              costs: 0,
              soort: 'mobiel' // default soort is mobiel. Dit wordt veranderd zodra het vast blijkt te zijn.
            };
          }
          if (t_mobile.summary.perType[key] === undefined) {
            t_mobile.summary.perType[key] = {
              costs: 0,
              soort: 'mobiel'
            };
          }

          // --------------------------------------
          //  CALCULATE COSTS FOR ALL "CALL" TYPES
          // --------------------------------------

          costs = parseFloat(call[11].replace(',','.')) * 100;

          if (isNaN(costs)) { costs = 0; }

          t_mobile.numberObject[number].summary.perType[key].costs = t_mobile.numberObject[number].summary.perType[key].costs + costs;
          t_mobile.numberObject[number].summary.totalCosts = t_mobile.numberObject[number].summary.totalCosts + costs;

          t_mobile.summary.totalCosts = t_mobile.summary.totalCosts + costs;
          t_mobile.summary.perType[key].costs = t_mobile.summary.perType[key].costs + costs;


          // --------------------------------------
          //   CALCULATE LANDLINE COSTS
          // --------------------------------------
          if (type === 'TELVM') {

            // add time to sumary
            if (t_mobile.numberObject[number].summary.perType[key].time === undefined) {
              t_mobile.numberObject[number].summary.perType[key].time = 0;
            }
            if (t_mobile.summary.perType[key].time === undefined) {
              t_mobile.summary.perType[key].time = 0;
            }

            t_mobile.numberObject[number].summary.perType[key].soort = 'vast';

            t_mobile.summary.perType[key].soort = 'vast'; // als het type 'TELVM' is, dan gaat het over een gesprek vanaf een vaste telefoon, dus veranderen vanaf defuault 'mobiel'

            time = call[9].split(':');
            time = parseInt(time[0])*60 + parseInt(time[1]);

            t_mobile.numberObject[number].summary.perType[key].time = t_mobile.numberObject[number].summary.perType[key].time + time;
            t_mobile.numberObject[number].summary.totalTime = t_mobile.numberObject[number].summary.totalTime + time;
            t_mobile.summary.perType[key].time = t_mobile.summary.perType[key].time + time;
            t_mobile.summary.totalTime = t_mobile.summary.totalTime + time;

            // save call
            if (t_mobile.numberObject[number].calls[key] === undefined) {
              t_mobile.numberObject[number].calls[key] = [];
            }
            t_mobile.numberObject[number].calls[key].push({
              datum: call[4].replace(/\./g,'-'),
              starttijd: call[5],
              duur: call[9],
              bestemming: call[7],
              kosten: costs,
              vanuit: call[8],
            });

          }

          // --------------------------------------
          //   CALCULATE COSTS IN THE NETHERLANDS
          // --------------------------------------
          if (type === 'TEL') {
            // add time to sumary
            if (t_mobile.numberObject[number].summary.perType[key].time === undefined) {
              t_mobile.numberObject[number].summary.perType[key].time = 0;
            }
            if (t_mobile.summary.perType[key].time === undefined) {
              t_mobile.summary.perType[key].time = 0;
            }

            time = call[9].split(':');
            time = parseInt(time[0])*60 + parseInt(time[1]);

            t_mobile.numberObject[number].summary.perType[key].time = t_mobile.numberObject[number].summary.perType[key].time + time;
            t_mobile.numberObject[number].summary.totalTime = t_mobile.numberObject[number].summary.totalTime + time;
            t_mobile.summary.perType[key].time = t_mobile.summary.perType[key].time + time;
            t_mobile.summary.totalTime = t_mobile.summary.totalTime + time;

            // save call
            if (t_mobile.numberObject[number].calls[key] === undefined) {
              t_mobile.numberObject[number].calls[key] = [];
            }

            t_mobile.numberObject[number].calls[key].push({
              datum: call[4].replace(/\./g,'-'),
              starttijd: call[5],
              duur: call[9],
              bestemming: call[7],
              kosten: costs,
              vanuit: call[8],
            });

          }

          // --------------------------------------
          //       CALCULATE INTERNET STUFF
          // --------------------------------------
          if (type === 'DATA') {
            // add data to sumary
            if (t_mobile.numberObject[number].summary.perType[key].data === undefined) {
              t_mobile.numberObject[number].summary.perType[key].data = 0;
            }
            if (t_mobile.summary.perType[key].data === undefined) {
              t_mobile.summary.perType[key].data = 0;
            }

            t_mobile.numberObject[number].summary.perType[key].data = t_mobile.numberObject[number].summary.perType[key].data + parseInt(call[9]);
            t_mobile.summary.perType[key].data = t_mobile.summary.perType[key].data + parseInt(call[9]);
            t_mobile.summary.totalKB = t_mobile.summary.totalKB + parseInt(call[9]);

            // save data usage
            if (t_mobile.numberObject[number].data[key] === undefined) {
              t_mobile.numberObject[number].data[key] = [];
            }
            t_mobile.numberObject[number].data[key].push({
              datum: call[4].replace(/\./g,'-'),
              kosten: costs,
              vanuit: call[8],
              grootte: call[9],
            });

          }

          // --------------------------------------
          //        CALCULATE MESSAGE STUFF
          // --------------------------------------
          if ((type === 'SMS') || (type === 'MMS')) {
            // add amount to sumary
            if (t_mobile.numberObject[number].summary.perType[key].amount === undefined) {
              t_mobile.numberObject[number].summary.perType[key].amount = 0;
            }
            if (t_mobile.summary.perType[key].amount === undefined) {
              t_mobile.summary.perType[key].amount = 0;
            }

            t_mobile.numberObject[number].summary.perType[key].amount = t_mobile.numberObject[number].summary.perType[key].amount + 1;
            t_mobile.summary.perType[key].amount = t_mobile.summary.perType[key].amount + 1;
            t_mobile.summary.totalSMS = t_mobile.summary.totalSMS + 1;
          }

        }


        t_mobile.numbers = [];
        for (let number in t_mobile.numberObject) {
          t_mobile.numbers.push({
            number: number,
            calls: t_mobile.numberObject[key].calls,
            data: t_mobile.numberObject[key].data,
            summary: t_mobile.numberObject[key].summary
          });
        }
        delete t_mobile.numberObject;

        return t_mobile;

      }
    };
  });

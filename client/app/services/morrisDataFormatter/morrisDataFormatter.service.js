/*jshint camelcase: false */

'use strict';

angular.module('ictsAppApp')
  .factory('morrisDataFormatter', function($filter) {

    // Service logic
    var blueColors = ['#0B62A4', '#3980B5', '#679DC6', '#95BBD7', '#B0CCE1', '#095791', '#095085', '#083E67', '#052C48', '#042135']; // blue colors stolen from morris.js
    blueColors = blueColors.concat(blueColors.concat(blueColors));    // double a few times to make sure it is long enough
    var redColors =  ['#c20000', '#ff1a1a', '#ff4747', '#9e0000', '#ffb8b8', '#ff7575', '#ff9494', '#700000'];
    redColors = redColors.concat(redColors.concat(redColors));        // double a few times to make sure it is long enough

    const timeFormatter = (y) => {
      if (Math.round(y/3600) === 0) {
        if (Math.round(y/60) === 0) {
          return y + ' sec.';
        } else {
          return Math.round(y/60) + ' min.';
        }
      } else {
        return Math.round(y/3600) + ' uur';
      }
    };

    const costsFormatter = y => `€ ${y/100}`;
    const dataFormatter = y => `${Math.round(y/1000000)} GB`;
    const smsFormatter = y => y;

    function details(t_mobile) {

        var costsDataLandline = [];
        var costsDataMobile = [];
        var timeDataLandline = [];
        var timeDataMobile = [];
        var dataData = [];
        var smsData = [];

        const types = t_mobile.summary.perType;
        Object.keys(types).forEach(key => {
          if (types[key].soort === 'vast') {
            costsDataLandline.push({label: key.toNormal(), value: types[key].costs});
          } else {
            costsDataMobile.push({label: key.toNormal(), value: types[key].costs});
          }
          if (types[key].time !== undefined){
            if (types[key].soort === 'vast') {
              timeDataLandline.push({label: key.toNormal(), value: Math.round(types[key].time)});
            } else {
              timeDataMobile.push({label: key.toNormal(), value: Math.round(types[key].time)});
            }
          }
          if (types[key].data !== undefined){
            dataData.push({label: key.toNormal(), value: Math.round(types[key].data)});
          }
          if (types[key].amount !== undefined){
            smsData.push({label: key.toNormal(), value: Math.round(types[key].amount)});
          }
        });

        // match color with type (landline/mobile)
        var costsData = costsDataLandline;
        costsData = costsData.concat(costsDataMobile);
        var colorsCosts = redColors.slice(0, costsDataLandline.length);
        colorsCosts = colorsCosts.concat(blueColors.slice(0, costsDataMobile.length));

        // match color with type (landline/mobile)
        var timeData = timeDataLandline;
        timeData = timeData.concat(timeDataMobile);
        var colorsTime = redColors.slice(0, timeDataLandline.length);
        colorsTime = colorsTime.concat(blueColors.slice(0, timeDataMobile.length));

        var smsColors = blueColors.slice(0, smsData.length);
        var dataColors = blueColors.slice(0, dataData.length);

        return {
          sms: {
            data: smsData,
            colors: smsColors,
            formatter: smsFormatter,
          },
          time: {
            data: timeData,
            colors: colorsTime,
            formatter: timeFormatter,
          },
          costs: {
            data: costsData,
            colors: colorsCosts,
            formatter: costsFormatter,
          },
          data: {
            data: dataData,
            colors: dataColors,
            formatter: dataFormatter,
          }
        };

    }

    function overview(t_mobile) {
      // console.log(t_mobile);
      return {
        y: $filter('date')(t_mobile.month, 'yyyy-MM'),
        t_mobile: t_mobile.summary.totalCosts / 100,
        total: t_mobile.summary.totalCosts / 100
      };
    }


    function personal(data) {
      var dataPersonal = [];
        for (var key in data.summary.perType) {
            dataPersonal.push({
              label: key.toNormal(),
              value: data.summary.perType[key].costs / 100
            });
        }
        return {
          data: dataPersonal,
          formatter: costsFormatter,
        };
    }

    function dashboard(months) {
      var data = {
        details: [],
        overview: [],
        date: [],
      };
      for (var i = 0; i <= months.t_mobile.length - 1; i++) {
        data.date[i] = new Date(months.t_mobile[i].month);
        data.overview[i] = overview(months.t_mobile[i]);
      }
      data.xkey = 'y';
      data.ykeys = ['t_mobile', 'total'];
      data.labels= ['T-mobile', 'Totaal'];

      return data;
    }



    // Public API here
    return {
      getOverviewData: function(t_mobile) {
        return details(t_mobile);
      },

      getPersonalData: function(data) {
        return personal(data);
      },

      getDashboardData: function(months) {
        return dashboard(months);
      }

  };
});

'use strict';

angular.module('ictsAppApp')
  .factory('morrisDataFormatter', function($filter) {
    
    // Service logic
    var blueColors = ['#0B62A4', '#3980B5', '#679DC6', '#95BBD7', '#B0CCE1', '#095791', '#095085', '#083E67', '#052C48', '#042135']; // blue colors stolen from morris.js
    blueColors = blueColors.concat(blueColors.concat(blueColors));    // double a few times to make sure it is long enough
    var redColors =  ['#c20000', '#ff1a1a', '#ff4747', '#9e0000', '#ffb8b8', '#ff7575', '#ff9494', '#700000'];
    redColors = redColors.concat(redColors.concat(redColors));        // double a few times to make sure it is long enough 

    var timeFormatter = function (y) { 
      if (Math.round(y/3600) == 0) {
        if (Math.round(y/60) == 0) {
          return y + ' sec.';
        } else {
          return Math.round(y/60) + ' min.';
        }
      } else {
        return Math.round(y/3600) + ' uur';
      }
    }

    var costsFormatter = function (y) { 
      return '€' + y;
    }

    var dataFormatter = function (y) { 
      return y + ' GB';
    }

    var smsFormatter = function (y) {
      return y;
    }


    function details(t_mobile) {

        var costsDataLandline = [];
        var costsDataMobile = [];
        var timeDataLandline = [];
        var timeDataMobile = [];
        var dataData = [];
        var smsData = [];   

        for (var type in t_mobile.summary.perType) {
          if (t_mobile.summary.perType[type].soort == 'vast') {
            costsDataLandline.push({label: type.toNormal(), value: t_mobile.summary.perType[type].costs/100});
          } else {
            costsDataMobile.push({label: type.toNormal(), value: t_mobile.summary.perType[type].costs/100});
          }
          if (t_mobile.summary.perType[type].time !== undefined){
            if (t_mobile.summary.perType[type].soort == 'vast') {
              timeDataLandline.push({label: type.toNormal(), value: Math.round(t_mobile.summary.perType[type].time/60)});
            } else {
              timeDataMobile.push({label: type.toNormal(), value: Math.round(t_mobile.summary.perType[type].time/60)});
            }
          }
          if (t_mobile.summary.perType[type].data !== undefined){
            dataData.push({label: type.toNormal(), value: Math.round(t_mobile.summary.perType[type].data/1000000)})
          }
          if (t_mobile.summary.perType[type].amount !== undefined){
            smsData.push({label: type.toNormal(), value: Math.round(t_mobile.summary.perType[type].amount)})
          }
        }

        // match color with type (landline/mobile)
        var costsData = costsDataLandline;
        costsData = costsData.concat(costsDataMobile);
        var colorsCosts = redColors.slice(0,costsDataLandline.length);
        colorsCosts = colorsCosts.concat(blueColors.slice(0,costsDataMobile.length));

        // match color with type (landline/mobile)
        var timeData = timeDataLandline;
        timeData = timeData.concat(timeDataMobile);
        var colorsTime = redColors.slice(0,timeDataLandline.length);
        colorsTime = colorsTime.concat(blueColors.slice(0,timeDataMobile.length));

        var smsColors = blueColors.slice(0,smsData.length);
        var dataColors = blueColors.slice(0,dataData.length);

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
        }


    };

    function overview(t_mobile) {
      // console.log(t_mobile);
      return {
        y: $filter('date')(t_mobile.month, 'yyyy-MM'),
        t_mobile: t_mobile.summary.totalCosts / 100,
        total: t_mobile.summary.totalCosts / 100
      }
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
        }
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
        return details(t_mobile)
      },

      getPersonalData: function(data) {
        return personal(data)
      },

      getDashboardData: function(months) {
        return dashboard(months)
      }

  }
});

/*jshint camelcase: false */

'use strict';

angular.module('ictsAppApp')
  .factory('graphDataFormatter', function($filter) {

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
          return Math.round(y/60) + ' min';
        }
      } else {
        return Math.round(y/3600) + ' uur';
      }
    };

    const costsFormatter = y => $filter('currency')(y/100, '€');
    const dataFormatter = y => `${Math.round(y/1000000)} GB`;
    const smsFormatter = y => y;

    function details(t_mobile) {

        let costsDataLandline = [], costsLabelsLandline = [];
        let costsDataMobile = [], costLabelsMobile = [];
        let timeDataLandline = [], timeLabelsLandline = [];
        let timeDataMobile = [], timeLabelsMobile = [];
        let dataData = [], dataLabels = [];
        let smsData = [], smsLabels = [];

        const types = t_mobile.summary.perType;
        Object.keys(types).forEach(key => {
          if (types[key].soort === 'vast') {
            costsDataLandline.push(types[key].costs);
            costsLabelsLandline.push(key.toNormal());
          } else {
            costsDataMobile.push(types[key].costs);
            costLabelsMobile.push(key.toNormal());
          }
          if (types[key].time !== undefined){
            if (types[key].soort === 'vast') {
              timeDataLandline.push(Math.round(types[key].time));
              timeLabelsLandline.push(key.toNormal());
            } else {
              timeDataMobile.push(Math.round(types[key].time));
              timeLabelsMobile.push(key.toNormal());
            }
          }
          if (types[key].data !== undefined){
            dataData.push(Math.round(types[key].data));
            dataLabels.push(key.toNormal());
          }
          if (types[key].amount !== undefined){
            smsData.push(Math.round(types[key].amount));
            smsLabels.push(key.toNormal());
          }
        });

        // match color with type (landline/mobile)
        const costsData = costsDataLandline.concat(costsDataMobile);
        const costLabels = costsLabelsLandline.concat(costLabelsMobile);
        const colorsCosts = redColors
          .slice(0, costsDataLandline.length)
          .concat(blueColors.slice(0, costsDataMobile.length));

        // match color with type (landline/mobile)
        const timeData = timeDataLandline.concat(timeDataMobile);
        const timeLabels = timeLabelsLandline.concat(timeLabelsMobile);
        const colorsTime = redColors
          .slice(0, timeDataLandline.length)
          .concat(blueColors.slice(0, timeDataMobile.length));

        const smsColors = blueColors.slice(0, smsData.length);
        const dataColors = blueColors.slice(0, dataData.length);

        return {
          sms: {
            data: smsData,
            labels: smsLabels,
            colors: smsColors,
            formatter: smsFormatter,
          },
          time: {
            data: timeData,
            labels: timeLabels,
            colors: colorsTime,
            formatter: timeFormatter,
          },
          costs: {
            data: costsData,
            labels: costLabels,
            colors: colorsCosts,
            formatter: costsFormatter,
          },
          data: {
            data: dataData,
            labels: dataLabels,
            colors: dataColors,
            formatter: dataFormatter,
          }
        };

    }


    function personal(n) {
      const data = Object.keys(n.summary.perType).map(key => n.summary.perType[key].costs);
      const labels = Object.keys(n.summary.perType).map(key => key.toNormal());
      const colors = blueColors.slice(0, labels.length);
      return {data, labels, colors, formatter: costsFormatter};
    }

    function dashboard(months) {
      const data = months.t_mobile.map(x => x.summary.totalCosts);
      const labels = months.t_mobile.map(x => new Date(x.month));
      const colors = colo
      return {data: [data], labels};
    }



    // Public API here
    return {
      getOverviewData: details,
      getPersonalData: personal,
      getDashboardData: dashboard
    }
});

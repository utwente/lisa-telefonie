'use strict';


angular.module('ictsAppApp')
  .factory('tMobileFields', [function() {

    // return Unknown if empty string
    const checkContent = (str) => str === ''? 'Unknown' : str;

    // simple returns here
    const formatFrom = (get) => (line) => checkContent(get(line, 'from'));
    const formatTo = (get) => (line) => checkContent(get(line, 'to'));
    const formatCountryFrom = (get) => (line) => checkContent(get(line, 'countryFrom'));
    const formatCountryTo = (get) => (line) => checkContent(get(line, 'countryTo'));

    // return both the type and subtype as subtype
    const formatSubtype = (get) => (line) =>
      get(line, 'type') + ' - ' + get(line, 'subtype');

    // format the date (input format = "30 10 2017 00:00:00,11:05:00")
    const formatDate = (get) => (line) => {
      const str = get(line, 'date');
      const day = str.split(' ');
      if (day.length !== 4) {
        return undefined;
      }
      const time = day[3].split(':');
      if (time.length !== 3) {
        return undefined;
      }
      const date = new Date(+day[2], +day[1] - 1, +day[0], +time[0], +time[1], +time[2]);
      if (isNaN(date.valueOf())){
        return undefined;
      }
      return date;
    };

    // check if number starts with 053 -> not mobile!
    const formatIsMobile = (get) => (line) => {
      const number = get(line, 'from');
      return number.slice(0, 3) !== '053';
    };

    // return the costs in cents (input format: "1,05")
    const formatCosts = (get) => (line) =>
      100 * +(get(line, 'costs').replace(',', '.'));

    // return the amount of data usage in kb (input format "1,611")
    const formatKb = (get) => (line) =>
      1000 * +(get(line, 'mb').replace(',', '.'));

    // get the duration of the call in seconds (input format "hh:mm:ss")
    const formatDuration = (get) => (line) => {
      const str = get(line, 'duration');
      const parts = str.split(':');
      if (parts.length !== 3) {
        return undefined;
      }
      return (+parts[0]*60*60) + (+parts[1]*60) + (+parts[2]);
    };

    // Public API
    return (get) => ({
      date: formatDate(get),
      from: formatFrom(get),
      to: formatTo(get),
      subtype: formatSubtype(get),
      countryFrom: formatCountryFrom(get),
      countryTo: formatCountryTo(get),
      costs: formatCosts(get),
      kb: formatKb(get),
      duration: formatDuration(get),
      isMobile: formatIsMobile(get),
    });

  }]);

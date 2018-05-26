'use strict';

angular.module('ictsAppApp')
.factory('tMobileConversion', ['$filter', ($filter) => {

  // for readability declare consts for each column name
  const A_NR = 1;
  const B_NR = 2;
  const DATE_TIME = 3;
  const DURATION = 4;
  const COSTS = 5;
  const TYPE = 6;

  // main phone numbers of the UTwente
  const NUMBER1 = '0534899111';
  const NUMBER2 = '0534899112';

  // row that should be in file, used to check if the file is right
  const CHECKROWLL = 'FIXED_NR,A_NR,B_NR,DATE_TIME,DURATION,AMOUNT,BREAKDOWN';
  const CHECKROWMOB = 'Phone number,Dialled number,Destination,Subdestination,Country of origin,Country of destination,Date - Time,Duration,MB,Cost,Category,Current node of the phone number,Client number of the phone number';

  // match first two characters of 4 character year
  const YEAR = /[0-9]{2}(?=[0-9]{2}$)/g;

  // format functions
  const f = {
    phone: x => x.replace(/^31/,'0'),                                           // in: 31534894434,         out: 0534894434
    datetime: x => x.replace(/\//g,' '),                                          // in: 01/10/2017 00:06:00  out: 01 10 2017 00:06:00
    duration: x => new Date(x * 1000).toISOString().substr(11, 8),              // in: 124                  out: 2:04 min.
    costs: x => $filter('number')(x, 2).replace('.',','),                       // in: .2                   out: 0,20
  };

  const formatApp = (line) => {
    const x = line.split(',');
    return `${f.phone(x[A_NR])},${f.phone(x[B_NR])},National,${x[TYPE]},Netherlands,,${f.datetime(x[DATE_TIME])},${f.duration(x[DURATION])},"0,000","${f.costs(x[COSTS])}",,,`;
  };

  return {
    toApp: (data) => {
      if (data.indexOf(CHECKROWLL) === -1) {
        throw new Error('Wrong input file..');
      }
      const res = data
        .replace(/\r/g, '')       // replace \r characters if present
        .split('\n')              // split by newline character
        .filter(l => l !== '')    // remove empty lines
        .slice(1)                 // remove first line
        .map(formatApp);          // format each line by formatApp function
      return res
    },

    merge: (dataMob, dataLL) => {
      if (dataMob.indexOf(CHECKROWMOB) === -1) {
        throw new Error('Wrong input file..');
      }
      const data =  dataMob
        .replace(/\r/g, '')
        .split('\n')
        .filter(l => l.split(',')[0] !== NUMBER1)
        .filter(l => l.split(',')[0] !== NUMBER2)
        .filter(l => l !== '');
      data.splice(2, 0, ...dataLL);
      return data.join('\n');
    }
  };

}]);

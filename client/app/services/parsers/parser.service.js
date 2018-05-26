'use strict';

/*
The expected input is an array with the following objects:

DATA TYPE:
{
  type: 'data',                                   -> should always be 'data'
  from: 0634272867,                               -> from phone number
  subtype: 'Data roaming'                         -> type of data usage
  country: 'Poland',                              -> in country
  date: Mon Dec 18 2017 15:41:59 GMT+0100 (CET),  -> date and time of data usage
  kb: 298,                                        -> data usage in kb
  cost: 345,                                      -> cost of data usage in € cents
}

CALL TYPE
{
  type: 'call',                                   -> should always be 'call'
  isMobile: false || true,                        -> call is mobile call or not
  from: 0534895545                                -> from phone number
  to: 0534897652                                  -> to phone number
  subtype: 'Internal'                             -> type of call
  countryFrom: 'Netherlands'                      -> from country
  countryTo: 'Netherlands'                        -> to country
  date:  Mon Dec 18 2017 15:41:59 GMT+0100 (CET)  -> date and time of call
  duration: 234                                   -> duration of call in seconds
  cost: 34                                        -> cost of call in € cents
}

MESSAGE TYPE:
{
  type: 'message',                                -> should always be 'message'
  from: 0634272867                                -> from phone number
  subtype: 'SMS roaming outgoing'                 -> type of message
  countryFrom: 'Netherlands',                     -> from country
  countryTo: 'Sweden'                             -> to country
  date: Mon Dec 18 2017 15:41:59 GMT+0100 (CET),  -> date and time of message
  cost: 345,                                      -> cost of message in € cents
}

*/

angular.module('ictsAppApp')
.factory('parser', ['$filter', function($filter) {

  const FIELDTYPES = [
    {
      name: 'isMobile',
      type: 'Boolean'
    },{
      name: 'from',
      type: 'String'
    },{
      name: 'to',
      type: 'String'
    },{
      name: 'type',
      type: 'Options',
      options: ['call','message','data']
    },{
      name: 'countryFrom',
      type: 'String'
    },{
      name: 'countryTo',
      type: 'String'
    },{
      name: 'date',
      type: 'Date'
    },{
      name: 'duration',
      type: 'Number'
    },{
      name: 'costs',
      type: 'Number'
    },{
      name: 'kb',
      type: 'Number'
    },{
      name: 'subtype',
      type: 'String'
    }
  ]

  const CALLFIELDS = ['isMobile', 'from', 'to', 'type', 'subtype', 'countryFrom', 'countryTo', 'date', 'duration', 'costs'];
  const DATAFIELDS = ['from', 'type', 'subtype', 'countryFrom', 'date', 'kb', 'costs'];
  const MESSAGEFIELDS = ['from', 'to', 'type', 'subtype', 'countryFrom', 'countryTo', 'date', 'costs'];

  const findType = (types, name) =>
    types.filter(x => x.name === name)[0];

  const checkType = (types, name, value) => {
    const type = findType(types, name);
    if (!type) { return false; }
    switch (type.type) {
      case 'Number':
        return (typeof value === 'number');
      case 'Date':
        return (typeof value.getMonth === 'function');
      case 'String':
        return (typeof value === 'string');
      case 'Boolean':
        return (typeof value === 'boolean');
      case 'Options':
        const res = type.options.filter(x => x === value);
        return res.length > 0;
    }
  }

  const makeCompareFields = (needed) => (actual) =>
    needed.every(
      x => Object.keys(actual).some(
        y => x === y
      )
    );

  const makeValidateFields = (types) => (record) =>
    Object.keys(record).every(
      name => checkType(types, name, record[name])
    );

  const checkCallFields = makeCompareFields(CALLFIELDS);
  const checkDataFields = makeCompareFields(DATAFIELDS);
  const checkMessageFields = makeCompareFields(MESSAGEFIELDS);

  const validateFields = makeValidateFields(FIELDTYPES);

  const emptyPerType = (type, isMobile) => {
    const soort = isMobile? 'mobiel' : 'vast';
    switch (type) {
      case 'call':
        return {costs: 0, time: 0, soort};
      case 'message':
        return {costs: 0, amount: 0, soort};
      case 'data':
        return {costs: 0, data: 0, soort};
      default:
        throw new Error(`Unknown type "${type}"`);
    }
  }


  const parse = (providerParser, data) => {
    const result = providerParser(data);

    // if error, simply return the object with error
    if (result.error) {
      return result;
    }

    const last = result.data[result.data.length - 1];
    const date = new Date(last.date.getFullYear(), last.date.getMonth(), 1)


    const emptySummary = {
      totalCosts: 0,
      totalKB: 0,
      totalSMS: 0,
      totalTime: 0,
    };

    const provider = {
      summary: Object.assign({perType: {}}, emptySummary),
      numbers: {},
      month: date,
    };

    const numbers = {};

    // rename for readability
    const summary = provider.summary;
    const types = summary.perType;

    result.data.forEach((line, i) => {
      // check if line is in right format
      if (!validateFields(line)){
        throw Error(`Error on line ${i}, one of the fields is not of the right type.`);
      }

      // store for readability
      const number = line.from;
      const costs = line.costs || 0;
      const duration = line.duration || 0;
      const kb = line.kb || 0;
      const sms = line.type === 'message'? 1 : 0;
      const type = line.type;
      const subtype = line.subtype;
      const isMobile = line.isMobile;
      const minutes = Math.floor(duration/60);
      const seconds = duration - 60*Math.floor(duration/60);

      // update totals
      summary.totalSMS += sms;
      summary.totalTime += duration;
      summary.totalKB += kb;
      summary.totalCosts += costs;

      // create number if not present
      if (!numbers[number]){
        numbers[number] = {
          summary: Object.assign({perType: {}}, emptySummary),
          calls: [],
          data: [],
          messages: []
        }
      }

      // for readability
      const curCalls = numbers[number].calls;
      const curData = numbers[number].data;
      const curMsg = numbers[number].messages;
      const curSummary = numbers[number].summary;
      const curTypes = curSummary.perType;

      // create subtype if not yet present
      if (!curTypes[subtype]) {
        curTypes[subtype] = emptyPerType(type, isMobile);
      }

      // create subtype if not yet present
      if (!types[subtype]) {
        types[subtype] = emptyPerType(type, isMobile);
      }

      // update total costs
      curSummary.totalCosts += costs;
      types[subtype].costs += costs;
      curTypes[subtype].costs += costs;

      switch (type) {
        case 'call':
          curTypes[subtype].time += duration;
          types[subtype].time += duration;
          curSummary.totalTime += duration;
          curCalls.push({
            type: subtype,
            datum: $filter('date')(line.date, 'yyyy-MM-dd'),
            kosten: costs,
            vanuit: line.countryFrom,
            duur: `${minutes}:${seconds < 10? '0':''}${seconds} min.`,
            bestemming: line.to,
            starttijd: $filter('date')(line.date, 'hh:mm'),
          })
          break;
        case 'message':
          curTypes[subtype].amount += sms;
          types[subtype].amount += sms;
          curSummary.totalSMS += sms;
          curMsg.push({
            type: subtype,
            datum: $filter('date')(line.date, 'yyyy-MM-dd'),
            kosten: costs,
            bestemming: line.to,
            vanuit: line.countryFrom,
          })
          break;
        case 'data':
          curTypes[subtype].data += kb;
          types[subtype].data += kb;
          curSummary.totalKB += kb;
          curData.push({
            type: subtype,
            datum: $filter('date')(line.date, 'yyyy-MM-dd'),
            kosten: costs,
            vanuit: line.countryFrom,
            grootte: kb + ' KB',
          })
          break;
        default:
          throw new Error(`Unknonw type: ${type}`);
      }

    })

    // rewrite numbers to array
    provider.numbers = Object.keys(numbers).map(
      n => Object.assign({number: n}, numbers[n])
    );

    return {error: false, data: provider};

  };

  return parse;

}]);

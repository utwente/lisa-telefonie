/*global Papa */
'use strict';

angular.module('ictsAppApp')
  .factory('tMobileParser', ['tMobileFields', function(tMobileFields) {

    // first line that contains actual data
    const OFFSET = 2;


    "Telefoonnummer","Gebelde nummer","Bestemming","Bestemming in detail","Land van herkomst","Land van bestemming","Datum en tijd","Duur","MB","Kosten","Categorie","Current node of the phone number","Client number of the phone number"

    // This is used to find the right fields from the file
    const FIELDS = [
      {
        name: 'Telefoonnummer',
        key: 'from'
      },{
        name: 'Gebelde nummer',
        key: 'to'
      },{
        name: 'Bestemming',
        key: 'type'
      },{
        name: 'Bestemming in detail',
        key: 'subtype'
      },{
        name: 'Land van herkomst',
        key: 'countryFrom'
      },{
        name: 'Datum en tijd',
        key: 'date'
      },{
        name: 'Duur',
        key: 'duration'
      },{
        name: 'MB',
        key: 'mb'
      },{
        name: 'Kosten',
        key: 'costs'
      },{
        name: 'Land van bestemming',
        key: 'countryTo'
      }
    ];

    const TYPES = [
      {
        name: 'Data',
        type: 'data'
      },{
        name: 'SMS',
        type: 'message'
      },{
        name: 'Internal',
        type: 'call'
      },{
        name: 'National',
        type: 'call'
      },{
        name: 'International',
        type: 'call'
      },{
        name: 'Services',
        type: 'message'
      },{
        name: 'Roaming',
        type: 'call'
      }
    ];


    // find index in csv file for certain offset
    const makeIndexInCsv = (offset) => (ix) => offset + ix + 1;

    // find indices in csv file of the fields given by fields, returns array with {key: 'keyname', ix: index number}
    const makeFindIndices = (fields) => (row) =>
      fields
        .map(f => ({key: f.key, ix: row.indexOf(f.name)}))
        .filter(x => x.ix !== -1);

    // this lists a certain field of an array with objects
    const makeListField = (field) => (arr) =>
      arr
        .map(x => x[field])
        .join(', ');

    // use this function to return an error with a certain message
    const handleError = (msg) => ({error: true,  msg});

    // preset some stuff
    const listNames = makeListField('name');
    const fieldIndices = makeFindIndices(FIELDS);
    const indexInCsv = makeIndexInCsv(OFFSET);

    // this finds the index of a given key in ixs array (returned by makeFindIndices)
    const makeGet = (ixs) => (line, key) => {
      const ix = ixs.filter(x => x.key === key);
      if (ix.length === 0) {
        return undefined;
      }
      return line[ix[0].ix];
    };

    // this function returns the call type (either call, message or data)
    const makeGetType = (types, get) => (call) => {
      const name = get(call, 'type');
      const type = types.filter(x => x.name === name);
      if (type.length !== 0) {
        return type[0].type;
      } else {
        return undefined;
      }
    };

    const listUndefinedFields = (obj) => {
      const undef = Object.keys(obj)
        .filter(x => obj[x] === undefined)
        .join(', ');
      return undef === ''? undefined : undef;
    };

    // this function is used to create a line with an error.
    const formatError = (msg) => ({type: 'error', msg});

    // first argument is a function that returns the index of a certain field, second argument is the line in the csv file
    const formatCall = (format) => (line, ix) => {
      const isMobile = format.isMobile(line);
      const from = format.from(line);
      const to = format.to(line);
      const subtype = format.subtype(line);
      const countryFrom = format.countryFrom(line);
      const countryTo = format.countryTo(line);
      const date = format.date(line);
      const duration = format.duration(line);
      const costs = format.costs(line);

      const result =  {
          type: 'call',
          isMobile,
          from,
          to,
          subtype,
          countryFrom,
          countryTo,
          date,
          duration,
          costs,
      };

      const undef = listUndefinedFields(result);
      if (undef) {
        return formatError(`Een van de velden op regel ${indexInCsv(ix)} staat niet in het juiste formaat. Key(s): "${undef}"`);
      }
      return result;
    };


    const formatData = (format) => (line, ix) => {
      const from = format.from(line);
      const subtype = format.subtype(line);
      const countryFrom = format.countryFrom(line);
      const date = format.date(line);
      const kb = format.kb(line);
      const costs = format.costs(line);

      const result = {
        type: 'data',
        from,
        subtype,
        countryFrom,
        date,
        kb,
        costs,
        isMobile: true,
      };

      const undef = listUndefinedFields(result);
      if (undef) {
        return formatError(`Een van de velden op regel ${indexInCsv(ix)} staat niet in het juiste formaat. Key(s): "${undef}"`);
      }
      return result;
    };

    const formatMessage = (format) => (line, ix) => {
      const from = format.from(line);
      const to = format.to(line);
      const subtype = format.subtype(line);
      const countryFrom = format.countryFrom(line);
      const countryTo = format.countryTo(line);
      const date = format.date(line);
      const costs = format.costs(line);

      const result = {
        type: 'message',
        from,
        to,
        subtype,
        countryFrom,
        countryTo,
        date,
        costs,
        isMobile: true,
      };

      const undef = listUndefinedFields(result);
      if (undef) {
        return formatError(`Een van de velden op regel ${indexInCsv(ix)} staat niet in het juiste formaat. Field(s): "${undef}"`);
      }
      return result;
    };

    // this function wraps the format functions with the getter function for index fields
    const makeFormatLine = (format) => ({
      call: formatCall(format),
      data: formatData(format),
      message: formatMessage(format),
      error: formatError
    });


    const parse = (fileContent) => {
      // parse the data using Papa
      const csv = Papa.parse(fileContent, {delimiter: ','});
      if (csv.errors.length !== 0) {
        return handleError('Fout bij het lezen van het CSV bestand.');
      }

      // find the indices of the fields as defined in FIELDS
      const allLines = csv.data;
      const ixs = fieldIndices(allLines[0]);
      if (ixs.length !== FIELDS.length) {
        return handleError(`Niet alle velden konden gevonden worden. De verwachte velden zijn: ${listNames(FIELDS)}`);
      }

      // create getter function for index of certain key and call type
      const get = makeGet(ixs);                       // -> sets up the get function
      const getType = makeGetType(TYPES, get);        // -> sets up function to get the type of call
      const formatField = tMobileFields(get);         // -> sets up the formatter functionality in tMobileFields.service.js
      const format = makeFormatLine(formatField);     // -> feeds the formatter functionality to makeFormatLine

      // remove first two lines from lines array (as they contain field types and total costs)
      const lines = allLines.slice(OFFSET);

      // format data in the right fashion
      const formatted = lines.map((line, ix) => {
        switch (getType(line)) {
          case 'call':
            return format.call(line, ix);
          case 'data':
            return format.data(line, ix);
          case 'message':
            return format.message(line, ix);
          default:
            return format.error(`Regel ${ix + OFFSET + 1} bevat een onbekend record type "${line[get('type')]}". Verwachte types zijn: ${listNames(TYPES)}`);
        }
      });

      // check if there are errors, if so -> return error message.
      const errors = formatted.filter(x => x.type === 'error');
      if (errors.length !== 0) {
        const errmsg = errors.reduce((prev, err) =>
          prev + '<br>' + err.msg, '');
        return handleError(errmsg);
      }

      // no errors! return result.
      return {err: false, data: formatted};

    };

    // Public API
    return parse;

  }]);

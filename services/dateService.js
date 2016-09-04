const moment = require('moment');
require('twix');

/**
 * Creates an Iterator of days in the from-to date range
 * @param fromDate beginning of date range
 * @param toDate end of date range, inclusive
 * @returns {*} Iterator of dates in range as Moments
 */
exports.getRange = (fromDate, toDate) => {
  // Date format doesn't conform to expected form, specify construction
  const from = moment(fromDate, 'MM/DD/YYYY');
  const to = moment(toDate, 'MM/DD/YYYY');
  const range = from.twix(to, { allDay: true });

  return range.iterate('days');
};

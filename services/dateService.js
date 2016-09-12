const moment = require('moment');
require('twix'); // injects itself into moment

/**
 * Ensures dates are provided in a format Moment can parse
 * @param date Date being inspected
 * @returns {*} Moment object representing the date
 */
function ensureDateFormat(date) {
  if ((/[0-9]{2}\/[0-9]{2}\/[0-9]{2}/).test(date)) {
    return moment(date, 'MM/DD/YYYY');
  }

  return moment(date);
}

/**
 * Creates an Iterator of days in the from-to date range
 * @param fromDate beginning of date range
 * @param toDate end of date range, inclusive
 * @returns {*} Iterator of dates in range as Moments
 */
exports.getRange = (fromDate, toDate) => {
  // Ensure proper date format
  const from = ensureDateFormat(fromDate);
  const to = ensureDateFormat(toDate);

  const range = from.twix(to, { allDay: true });

  return range.iterate('days');
};

/**
 * Returns an ISO 8601 string of the date some number of days after the beginDate
 * @param beginDate ISO 8601 string or date formatted MM/DD/YYYY
 * @param num number of days after beginDate
 * @returns {*} ISO 8601 string
 */
exports.endOfRange = (beginDate, num) => {
  const begin = ensureDateFormat(beginDate);
  const end = begin.add(num, 'days');

  return end.format('YYYY-MM-DD');
};

/**
 * Formats a Moment-readable date into an ISO 8601 string
 * @param date String being formatted. Must be a Moment-readable date or datetime.
 */
exports.formatDate = (date) => moment(date).format('YYYY-MM-DD');

/**
 * Returns ISO 8601 String of current datetime
 */
exports.now = () => moment.utc().format();

/**
 * Returns current ISO 8601 string of current date
 */
exports.date = () => moment.utc().format('YYYY-MM-DD');

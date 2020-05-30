// ! REQUIRE MOMENT.JS AND MOMENT-TIMEZONE-WITH-DATA.JS to get TimeZone abbreviations
// Load momentjs in the html head before this js:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.26.0/moment.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.31/moment-timezone-with-data.js"></script> */}

/**
 * Extract and Convert a string containing date or date range to a proper format
 * @param {string} dateInput A string containing date in dd/mm/yyyy format
 * @return {Array} An array of string of date in this format [yyyy-mm-dd] or [yyyy-mm-dd, yyyy-mm-dd]
 */
function getDate (dateInput) {
  const regex = /([0-9]{2})[\/]([0-9]{2})[\/]([0-9]{4})/g;
  let match;
  let dates = [];

  while ((match = regex.exec(dateInput)) !== null) {
    dates.push(match)
  }

  if (dates.length === 1) {
    return [[dates[0][3], dates[0][2], dates[0][1]].join('-')];
  } else if (dates.length === 2) {
    let startDate = [dates[0][3], dates[0][2], dates[0][1]].join('-');
    let endDate = [dates[1][3], dates[1][2], dates[1][1]].join('-');
    return [startDate, endDate];
  }
}

/**
 * Extract and Convert a string containing date or date range to a proper format
 * @param {string} timeInput A string containing time in HH:MM format
 * @return {string} An array of string of time in this format [HH:MM] or [HH:MM, HH:MM]
 */
function getTime (timeInput) {
  const regex = /([0-9]{2})[:]([0-9]{2})/g;
  let match;
  let times = [];

  while ((match = regex.exec(timeInput)) !== null) {
    times.push(match[0])
  }
  return times;
}

/**
 * Return a string of shorter time format
 * @param {string} timeString A string of time return by Date.toTimeString, example: '17:23:42 GMT+0800 (Singapore Standard Time)'
 * @param {boolean} includedTimezone (default value: true) whether or not the Time Zone should be included
 * @return {string} A new time string with just HH:MM (Timezone), example: '17:23 (Singapore Standard Time)'
 */
function getShortTime (timeString, includedTimezone = true) {
  if (timeString) {
    if (includedTimezone) {
      var newTime = timeString.replace(timeString.slice(5, 17), '')
      return newTime;
    } else {
      return timeString.slice(0, 5);
    }
  }
}

/**
 * Check if a Date is valid
 * @param {Date} d
 */
function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

document.addEventListener('DOMContentLoaded', function () {
  if (typeof moment !== 'undefined') {
    // Ref: https://medium.com/frntndr/how-to-find-timezone-name-and-abbreviation-using-moment-js-736fd7af64f7
    var timeZone = moment.tz.guess();
    // console.log(timeZone);
    var timeZoneAbbr = moment.tz(timeZone).zoneAbbr();
    // console.log(timeZoneAbbr);
  }

  document.querySelectorAll('.covidrow').forEach(function (row) {
    // Get the input date and time for each event
    const dateElement = row.querySelector('.columnb1');
    const timeElement = row.querySelector('.columnb2');

    // Get original dateInput string
    var dateInput = dateElement.textContent;
    var [startDate, endDate] = getDate(dateInput);

    // Get original timeInput string
    var timeInput = timeElement.textContent;
    var [startTime, endTime] = getTime(timeInput);

    // Construct new Date object
    if (endDate && endTime) {
      var jsEndDateTimeObj = new Date(`${endDate} ${endTime} UTC+1`);
      var localEndDate = jsEndDateTimeObj.toDateString();
      var localEndTime = jsEndDateTimeObj.toTimeString();
    }
    var jsStartDateTimeObj = new Date(`${startDate} ${startTime} UTC+1`);
    var localStartDate = jsStartDateTimeObj.toDateString();
    var localStartTime = jsStartDateTimeObj.toTimeString();

    // Make sure that at least one of the jsDateTime objects is valid
    if (isValidDate(jsEndDateTimeObj) || isValidDate(jsStartDateTimeObj)) {
      // Replace the original date and time with local date and time
      dateElement.innerHTML = [localStartDate, localEndDate].filter(Boolean).join('–');

      let timeRange;
      if (timeZoneAbbr) {
        timeRange = [getShortTime(localStartTime, false), getShortTime(localEndTime, false)]
          .filter(Boolean)
          .join('-');
        timeRange = `${timeRange} ${timeZoneAbbr}`;
      } else {
        // Remove timezone for localStartTime if localEndTime exists
        timeRange = [getShortTime(localStartTime, (!localEndTime)), getShortTime(localEndTime, true)]
          .filter(Boolean)
          .join('–');
      }

      // use childNodes[0] to change the text of the the div only
      // ! it is important that the textContent is the first part of timeElement
      timeElement.childNodes[0].nodeValue = timeRange;
    }
  })
})

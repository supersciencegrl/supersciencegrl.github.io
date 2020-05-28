/**
 * Extract and Convert a string containing date or date range to a proper format
 * @param {string} dateInput: string containing date in dd/mm/yyyy format
 * @return : an array of string of date in this format [yyyy-mm-dd] or [yyyy-mm-dd, yyyy-mm-dd]
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
 * @param {string} timeInput: string containing time in HH:MM format
 * @return : an array of string of time in this format [HH:MM] or [HH:MM, HH:MM]
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
 * Return a shorter time format
 * @param {string} timeString : a string of time return by Date.toTimeString, example: '17:23:42 GMT+0800 (Singapore Standard Time)'
 * @return {string} : new time string with just HH:MM (Timezone), example: '17:23 (Singapore Standard Time)'
 */
function getShortTime (timeString) {
  if (timeString) {
    var newTime = timeString.replace(timeString.slice(5, 17), '')
    return newTime;
  }
}

document.addEventListener('DOMContentLoaded', function () {
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

    var localStartDate;
    var localEndDate;
    var localStartTime;
    var localEndTime;

    // Construct new Date object
    if (endDate && endTime) {
      var jsEndDateTimeObj = new Date(`${endDate} ${endTime} UTC+1`);
      localEndDate = jsEndDateTimeObj.toDateString();
      localEndTime = jsEndDateTimeObj.toTimeString();
    }
    var jsStartDateTimeObj = new Date(`${startDate} ${startTime} UTC+1`);
    localStartDate = jsStartDateTimeObj.toDateString();
    localStartTime = jsStartDateTimeObj.toTimeString();

    // Remove timezone for localStartTime if localEndTime exists
    localStartTime = localEndTime ? localStartTime.slice(0, 18) : localStartTime;

    // Replace the original date and time with local date and time
    dateElement.innerHTML = [localStartDate, localEndDate].filter(Boolean).join(' - ');

    // use childNodes[0] to change the text of the the div only
    // ! it is important that the textContent is the first part of timeElement
    timeElement.childNodes[0].nodeValue = [getShortTime(localStartTime), getShortTime(localEndTime)].filter(Boolean).join(' - ');
  })
})

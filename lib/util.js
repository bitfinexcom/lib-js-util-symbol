'use strict'

const moment = require('moment')

/**
 * Calculates nth day of month, e.g. 3rd friday of march
 * @param {string} year format YYYY
 * @param {string} month format MM
 * @param {number} week 1-4
 * @param {number} day 0-Monday,... 6-Sunday
 */
const nth_day_of_month = (year, month, week, day) => {
  if (!/^\d{4}$/.test(year)) throw new Error('ERR_DATE_INVALID_YEAR')
  if (!/^\d{2}$/.test(month)) throw new Error('ERR_DATE_INVALID_MONTH')
  if (week < 1 || week > 4) throw new Error('ERR_DATE_INVALID_WEEK')
  if (day < 0 || day > 6) throw new Error('ERR_DATE_INVALID_DAY')

  let weekDay = moment(`${year}-${month}-01`, 'YYYY-MM-DD').isoWeekday() - 1
  let weekCount = weekDay === day ? 1 : 0
  let date = 1

  while (weekCount < week) {
    date++
    weekDay++
    weekDay = weekDay % 7
    if (weekDay === day) weekCount++
  }

  return date < 10 ? `0${date}` : date.toString()
}

module.exports = {
  nth_day_of_month: nth_day_of_month
}

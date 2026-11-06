'use strict'

const test = require('brittle')

const monthTable = require('../lib/month.map')

const { nth_day_of_month: nthDayOfMonth } = require('../lib/util')
const { parse_quarterly_contract: parseQuarterlyContract } = require('../index')

test('nth_day_of_month fails with invalid year', (t) => {
  t.exception(() => nthDayOfMonth('twenty', '03', 3, 4), /ERR_DATE_INVALID_YEAR/)
})

test('nth_day_of_month fails with invalid month', (t) => {
  t.exception(() => nthDayOfMonth('2020', 'july', 3, 4), /ERR_DATE_INVALID_MONTH/)
})

test('nth_day_of_month fails with invalid week', (t) => {
  t.exception(() => nthDayOfMonth('2020', '03', 5, 4), /ERR_DATE_INVALID_WEEK/)
})

test('nth_day_of_month fails with invalid day', (t) => {
  t.exception(() => nthDayOfMonth('2020', '03', 3, 7), /ERR_DATE_INVALID_DAY/)
})

test('nth_day_of_month returns expected values', (t) => {
  t.is(nthDayOfMonth('2020', '03', 4, 4), '27')
  t.is(nthDayOfMonth('2020', '01', 1, 2), '01')
})

test('parse_quarterly_contract fails with invalid formats', (t) => {
  t.exception(() => parseQuarterlyContract('BTCH20:USTF0'), /ERR_INVALID_SYM/)
  t.exception(() => parseQuarterlyContract('BTCFH2a:USTF0'), /ERR_INVALID_SYM/)
  t.exception(() => parseQuarterlyContract('BTCFA20:USTF0'), /ERR_INVALID_SYM/)
})

test('parse_quarterly_contract works with correct format', (t) => {
  const thirdFridays = ['17', '21', '20', '17', '15', '19', '17', '21', '18', '16', '20', '18']
  Object.keys(monthTable).forEach((key, i) => {
    const res = parseQuarterlyContract(`BTCF${key}20:USTF0`)
    const month = i + 1
    t.is(res.curr, 'BTC')
    t.is(res.day, thirdFridays[i])
    t.is(res.year, '2020')
    t.is(res.month, month < 10 ? `0${month}` : month.toString())
  })
})

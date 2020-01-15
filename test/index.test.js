'use strict'

const chai = require('chai').use(require('dirty-chai'))
const { expect } = chai

const monthTable = require('../lib/month.map')

const { nth_day_of_month } = require('../lib/util')
const { parse_quarterly_contract } = require('../index')

describe('*** Unit testing! ***', () => {
  describe('# nth_day_of_month', () => {
    it('it should fail with invalid year', () => {
      expect(
        nth_day_of_month.bind(null, 'twenty', '03', 3, 4)
      ).to.throw('ERR_DATE_INVALID_YEAR')
    })

    it('it should fail with invalid month', () => {
      expect(
        nth_day_of_month.bind(null, '2020', 'july', 3, 4)
      ).to.throw('ERR_DATE_INVALID_MONTH')
    })

    it('it should fail with invalid week', () => {
      expect(
        nth_day_of_month.bind(null, '2020', '03', 5, 4)
      ).to.throw('ERR_DATE_INVALID_WEEK')
    })

    it('it should fail with invalid day', () => {
      expect(
        nth_day_of_month.bind(null, '2020', '03', 3, 7)
      ).to.throw('ERR_DATE_INVALID_DAY')
    })

    it('it should return expected values', () => {
      expect(
        nth_day_of_month('2020', '03', 4, 4)
      ).to.be.equal('27')
      expect(
        nth_day_of_month('2020', '01', 1, 2)
      ).to.be.equal('01')
    })
  })

  describe('# parse_quarterly_contract', () => {
    it('it should fail with invalid formats', () => {
      expect(parse_quarterly_contract.bind(null, 'BTCH20:USTF0')).to.throw('ERR_INVALID_SYM')
      expect(parse_quarterly_contract.bind(null, 'BTCFH2a:USTF0')).to.throw('ERR_INVALID_SYM')
      expect(parse_quarterly_contract.bind(null, 'BTCFA20:USTF0')).to.throw('ERR_INVALID_SYM')
    })

    it('it should work with correct format', () => {
      const thirdFridays = ['17', '21', '20', '17', '15', '19', '17', '21', '18', '16', '20', '18']
      Object.keys(monthTable).forEach((key, i) => {
        const res = parse_quarterly_contract(`BTCF${key}20:USTF0`)
        expect(res.curr).to.be.equal('BTC')
        expect(res.day).to.be.equal(thirdFridays[i])
        expect(res.year).to.be.equal('2020')
        i++
        expect(res.month).to.be.equal(i < 10 ? `0${i}` : i.toString())
      })
    })
  })
})

'use strict'

const mockRestConf = jest.fn()
jest.mock('bfx-api-node-rest', () => ({
  RESTv2: jest.fn().mockImplementation(() => ({
    conf: mockRestConf
  }))
}))

const monthTable = require('../lib/month.map')

const { nth_day_of_month } = require('../lib/util')
const { parse_quarterly_contract, ccy_translate, ccys_translate } = require('../index')

describe('*** Unit testing! ***', () => {
  describe('# nth_day_of_month', () => {
    it('it should fail with invalid year', () => {
      expect(
        nth_day_of_month.bind(null, 'twenty', '03', 3, 4)
      ).toThrow('ERR_DATE_INVALID_YEAR')
    })

    it('it should fail with invalid month', () => {
      expect(
        nth_day_of_month.bind(null, '2020', 'july', 3, 4)
      ).toThrow('ERR_DATE_INVALID_MONTH')
    })

    it('it should fail with invalid week', () => {
      expect(
        nth_day_of_month.bind(null, '2020', '03', 5, 4)
      ).toThrow('ERR_DATE_INVALID_WEEK')
    })

    it('it should fail with invalid day', () => {
      expect(
        nth_day_of_month.bind(null, '2020', '03', 3, 7)
      ).toThrow('ERR_DATE_INVALID_DAY')
    })

    it('it should return expected values', () => {
      expect(
        nth_day_of_month('2020', '03', 4, 4)
      ).toEqual('27')
      expect(
        nth_day_of_month('2020', '01', 1, 2)
      ).toEqual('01')
    })
  })

  describe('# parse_quarterly_contract', () => {
    it('it should fail with invalid formats', () => {
      expect(parse_quarterly_contract.bind(null, 'BTCH20:USTF0')).toThrow('ERR_INVALID_SYM')
      expect(parse_quarterly_contract.bind(null, 'BTCFH2a:USTF0')).toThrow('ERR_INVALID_SYM')
      expect(parse_quarterly_contract.bind(null, 'BTCFA20:USTF0')).toThrow('ERR_INVALID_SYM')
    })

    it('it should work with correct format', () => {
      const thirdFridays = ['17', '21', '20', '17', '15', '19', '17', '21', '18', '16', '20', '18']
      Object.keys(monthTable).forEach((key, i) => {
        const res = parse_quarterly_contract(`BTCF${key}20:USTF0`)
        expect(res.curr).toEqual('BTC')
        expect(res.day).toEqual(thirdFridays[i])
        expect(res.year).toEqual('2020')
        i++
        expect(res.month).toEqual(i < 10 ? `0${i}` : i.toString())
      })
    })
  })

  describe('# ccys_translate', () => {
    beforeEach(() => {
      mockRestConf.mockClear()
    })

    it('returns mapped value', async () => {
      mockRestConf.mockResolvedValue([[['K1', 'V1'], ['K2', 'V2']]])
      const result = await ccys_translate(['K1', 'K2'])
      expect(result).toEqual(['V1', 'V2'])
    })

    it('looks up by upper cased value', async () => {
      mockRestConf.mockResolvedValue([[['K1', 'V1'], ['K2', 'V2']]])
      const result = await ccys_translate(['k1'])
      expect(result).toEqual(['V1'])
    })

    it('returns parameter if no mapping found', async () => {
      mockRestConf.mockResolvedValue([[['K1', 'V1'], ['K2', 'V2']]])
      const result = await ccys_translate(['k3'])
      expect(result).toEqual(['k3'])
    })
  })

  describe('# ccy_translate', () => {
    beforeEach(() => {
      mockRestConf.mockClear()
    })

    it('returns mapped value', async () => {
      mockRestConf.mockResolvedValue([[['K1', 'V1'], ['K2', 'V2']]])
      const result = await ccy_translate('K2')
      expect(result).toEqual('V2')
    })

    it('looks up by upper cased value', async () => {
      mockRestConf.mockResolvedValue([[['K1', 'V1'], ['K2', 'V2']]])
      const result = await ccy_translate('k1')
      expect(result).toEqual('V1')
    })

    it('returns parameter if no mapping found', async () => {
      mockRestConf.mockResolvedValue([[['K1', 'V1'], ['K2', 'V2']]])
      const result = await ccy_translate('k3')
      expect(result).toEqual('k3')
    })
  })
})

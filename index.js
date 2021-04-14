'use strict'

const { RESTv2 } = require('bfx-api-node-rest')
const util = require('./lib/util')
const monthTable = require('./lib/month.map')

const bfxRest2 = new RESTv2()

/**
 * @param {string} ccy
 */
const ccy_translate = async ccy => {
  const [res] = await ccys_translate([ccy])
  return res
}

/**
 * @param {string[]} ccys
 */
const ccys_translate = async ccys => {
  const [map] = await bfxRest2.conf(['pub:map:currency:sym'])
  const result = []
  for (const ccy of ccys) {
    const ccyUpper = ccy.toUpperCase()
    const ccyMapping = map.find(([k]) => k === ccyUpper)
    result.push(ccyMapping ? ccyMapping[1] : ccy)
  }

  return result
}

const pair_join = (ccy1, ccy2) => {
  const fv2 = ccy1.length > 3 || ccy2.length > 3
  return fv2 ? `${ccy1}:${ccy2}` : ccy1 + ccy2
}

const pair_ccy1 = (pair) => {
  return pair.length > 6 ? pair.split(':')[0] : pair.substr(0, 3)
}

const pair_ccy2 = (pair) => {
  return pair.length > 6 ? pair.split(':')[1] : pair.substr(3, 6)
}

const pair_split = (pair) => {
  return [pair_ccy1(pair), pair_ccy2(pair)]
}

const pair_reverse = (pair) => {
  return pair_join(pair_ccy2(pair), pair_ccy1(pair))
}

const pair_ccy_base = (amount, pair) => {
  return amount > 0 ? pair_ccy2(pair) : pair_ccy1(pair)
}

const pair_ccy_trading = (amount, pair) => {
  return amount > 0 ? pair_ccy1(pair) : pair_ccy2(pair)
}

const pair_deriv_spot = (pair) => {
  const ccys = pair_split(pair)
    .map(x => x.replace(/F[A-Z]{0,1}[0-9]{1,9}/, ''))
  return pair_join(ccys[0], ccys[1])
}

/**
 * @param {string} sym
 */
const parse_quarterly_contract = (sym) => {
  // format: <curr:3>F<month:1><day:2>, e.g. BTCFH20
  sym = sym.split(':')[0]
  if (sym.length !== 7) throw new Error('ERR_INVALID_SYM')
  const curr = sym.substr(0, 3)

  const year = '20' + sym.substr(sym.length - 2)
  if (!/^\d{4}$/.test(year)) throw new Error('ERR_INVALID_SYM')

  const m = sym[sym.length - 3]
  const month = monthTable[m]
  if (!month) throw new Error('ERR_INVALID_SYM')

  const day = util.nth_day_of_month(year, month, 3, 4)

  return { curr, year, month, day }
}

module.exports = {
  ccy_translate,
  ccys_translate,
  pair_join: pair_join,
  pair_ccy1: pair_ccy1,
  pair_ccy2: pair_ccy2,
  pair_split: pair_split,
  pair_reverse: pair_reverse,
  pair_ccy_base: pair_ccy_base,
  pair_ccy_trading: pair_ccy_trading,
  pair_deriv_spot: pair_deriv_spot,
  parse_quarterly_contract: parse_quarterly_contract
}

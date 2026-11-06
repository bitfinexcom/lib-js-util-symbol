'use strict'

const util = require('./lib/util')
const monthTable = require('./lib/month.map')

const pairJoin = (ccy1, ccy2) => {
  const fv2 = ccy1.length > 3 || ccy2.length > 3
  return fv2 ? `${ccy1}:${ccy2}` : ccy1 + ccy2
}

const pairCcy1 = (pair) => {
  return pair.length > 6 ? pair.split(':')[0] : pair.substr(0, 3)
}

const pairCcy2 = (pair) => {
  return pair.length > 6 ? pair.split(':')[1] : pair.substr(3, 6)
}

const pairSplit = (pair) => {
  return [pairCcy1(pair), pairCcy2(pair)]
}

const pairReverse = (pair) => {
  return pairJoin(pairCcy2(pair), pairCcy1(pair))
}

const pairCcyBase = (amount, pair) => {
  return amount > 0 ? pairCcy2(pair) : pairCcy1(pair)
}

const pairCcyTrading = (amount, pair) => {
  return amount > 0 ? pairCcy1(pair) : pairCcy2(pair)
}

const pairDerivSpot = (pair) => {
  const ccys = pairSplit(pair)
    .map(x => x.replace(/F[A-Z]{0,1}[0-9]{1,9}/, ''))
  return pairJoin(ccys[0], ccys[1])
}

/**
 * @param {string} sym
 */
const parseQuarterlyContract = (sym) => {
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
  pair_join: pairJoin,
  pair_ccy1: pairCcy1,
  pair_ccy2: pairCcy2,
  pair_split: pairSplit,
  pair_reverse: pairReverse,
  pair_ccy_base: pairCcyBase,
  pair_ccy_trading: pairCcyTrading,
  pair_deriv_spot: pairDerivSpot,
  parse_quarterly_contract: parseQuarterlyContract
}

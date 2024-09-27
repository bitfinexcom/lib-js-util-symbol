'use strict'

const FIAT_LIST = require('./fiat-symbols.json')
const BFX_SUPPORTED_FIATS = new Set(['USD', 'EUR', 'GBP', 'JPY', 'CNH'])

module.exports = {
  BFX_SUPPORTED_FIATS,
  FIAT_LIST
}

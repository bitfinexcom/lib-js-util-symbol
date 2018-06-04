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

module.exports = {
  pair_join: pair_join,
  pair_ccy1: pair_ccy1,
  pair_ccy2: pair_ccy2,
  pair_split: pair_split,
  pair_reverse: pair_reverse
}

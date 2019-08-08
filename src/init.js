/**
 * Initialization data of networks and contracts.
 */

const MAIN_NET_ID = '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a'

const TEST_NET_ID = '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127'

const MAIN_NET_CONTRACTS = require('./main_contracts.json')

const TEST_NET_CONTRACTS = require('./test_contracts.json')

const sortFunction = function (a, b) {
  if (a.symbol < b.symbol) {
    return -1
  }

  if (a.symbol > b.symbol) {
    return 1
  }
  
  return 0
}

const getContracts = function (isMainNet) {
  if (isMainNet) {
    return MAIN_NET_CONTRACTS.sort(sortFunction)
  } else {
    return TEST_NET_CONTRACTS.sort(sortFunction)
  }
}

export {
  MAIN_NET_CONTRACTS,
  TEST_NET_CONTRACTS,
  MAIN_NET_ID,
  TEST_NET_ID,
  getContracts
}

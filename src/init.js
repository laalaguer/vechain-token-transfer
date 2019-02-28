/**
 * Initialization data of networks and contracts.
 */

const MAIN_NET_CONTRACTS = [
  {
    'name': 'TicTalk Token',
    'symbol': 'TIC',
    'contract': '0xa94a33f776073423e163088a5078feac31373990',
    'decimals': 18,
    'icon': 'tic.png'
  },
  {
    'name': 'OceanEx Token',
    'symbol': 'OCE',
    'contract': '0x0ce6661b4ba86a0ea7ca2bd86a0de87b0b860f14',
    'decimals': 18,
    'icon': 'oce.png'
  },
  {
    'name': 'VeThor',
    'symbol': 'VTHO',
    'contract': '0x0000000000000000000000000000456e65726779',
    'decimals': 18,
    'icon': 'vtho.png'
  },
  {
    'name': 'Plair',
    'symbol': 'PLA',
    'contract': '0x89827f7bb951fd8a56f8ef13c5bfee38522f2e1f',
    'decimals': 18,
    'icon': 'pla.png'
  },
  {
    'name': 'Safe Haven Token',
    'symbol': 'SHA',
    'contract': '0x5db3c8a942333f6468176a870db36eef120a34dc',
    'decimals': 18,
    'icon': 'sha.png'
  },
  {
    'name': 'Decent.bet Token',
    'symbol': 'DBET',
    'contract': '0x1b8ec6c2a45cca481da6f243df0d7a5744afc1f8',
    'decimals': 18,
    'icon': 'dbet.png'
  },
  {
    'name': 'Bitarora Token',
    'symbol': 'BAG',
    'contract': '0x2182aa52adB1b27903d089e4432538A695effE3d',
    'decimals': 18,
    'icon': 'bag.png'
  }
]

const TEST_NET_CONTRACTS = [
  {
    'name': 'TicTalk Token',
    'symbol': 'TIC',
    'contract': '0x18081982d752ADd4f402AEAe480d6c90f7644427',
    'decimals': 18,
    'icon': 'tic.png'
  },
  {
    'name': 'OceanEx Token',
    'symbol': 'OCE',
    'contract': '0x18081982d752ADd4f402AEAe480d6c90f7644427',
    'decimals': 18,
    'icon': 'oce.png'
  },
  {
    'name': 'VeThor',
    'symbol': 'VTHO',
    'contract': '0x0000000000000000000000000000456e65726779',
    'decimals': 18,
    'icon': 'vtho.png'
  },
  {
    'name': 'Plair',
    'symbol': 'PLA',
    'contract': '0x18081982d752ADd4f402AEAe480d6c90f7644427',
    'decimals': 18,
    'icon': 'pla.png'
  },
  {
    'name': 'Safe Haven Token',
    'symbol': 'SHA',
    'contract': '0x18081982d752ADd4f402AEAe480d6c90f7644427',
    'decimals': 18,
    'icon': 'sha.png'
  },
  {
    'name': 'Decent.bet Token',
    'symbol': 'DBET',
    'contract': '0x18081982d752ADd4f402AEAe480d6c90f7644427',
    'decimals': 18,
    'icon': 'dbet.png'
  },
  {
    'name': 'Bitarora Token',
    'symbol': 'BAG',
    'contract': '0x18081982d752ADd4f402AEAe480d6c90f7644427',
    'decimals': 18,
    'icon': 'bag.png'
  }
]

const getContracts = function (isMainNet) {
  if (isMainNet) {
    return MAIN_NET_CONTRACTS
  } else {
    return TEST_NET_CONTRACTS
  }
}

const MAIN_NET_ID = '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a'
const TEST_NET_ID = '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127'

export {
  MAIN_NET_CONTRACTS,
  TEST_NET_CONTRACTS,
  MAIN_NET_ID,
  TEST_NET_ID,
  getContracts
}

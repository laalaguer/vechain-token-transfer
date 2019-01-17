/**
 * Connex related operations.
 */
const initData = require('./init.js')
/**
 * Return a Promise which will be resolved to {energy, balance, hasCode}
 * @param {String} address Address that begins with 0x
 */
async function getAccountBalance (address) {
  // eslint-disable-next-line
  const acc = connex.thor.account(address)
  const accInfo = await acc.get() // Wait for the Promise, then (automatically) unpacked when resolved.
  return accInfo
  // Async function (automatically) packs a Promise ready to be resolved with return value.
  // If anything goes wrong will pop out the exception.
}

/**
 * Get token amount of holder from a contract.
 * @param {String} addressContract 0x started address.
 * @param {String} addressHolder 0x started address.
 */
async function getTokenBalance (addressContract, addressHolder) {
  const balanceOfABI = {
    'constant': true,
    'inputs': [
      {
        'name': '_owner',
        'type': 'address'
      }
    ],
    'name': 'balanceOf',
    'outputs': [
      {
        'name': 'balance',
        'type': 'uint256'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }
  // eslint-disable-next-line
  const balanceOfMethod = connex.thor.account(addressContract).method(balanceOfABI)
  const balanceInfo = await balanceOfMethod.call(addressHolder)
  return balanceInfo
}

/**
 * Transfer token from one to another.
 * @param {String} addressContract Contract address.
 * @param {String} signerAddress Enforce who signs the transaction.
 * @param {String} toAddress Receiver of transfer.
 * @param {String} amountEVM Big number in string.
 * @param {Number} amountHuman Normal number in JS.
 * @param {String} symbol Symbol of token.
 */
async function transferToken (addressContract, signerAddress, toAddress, amountEVM, amountHuman, symbol) {
  const transferABI = {
    'constant': false,
    'inputs': [
      {
        'name': '_to',
        'type': 'address'
      },
      {
        'name': '_value',
        'type': 'uint256'
      }
    ],
    'name': 'transfer',
    'outputs': [
      {
        'name': '',
        'type': 'bool'
      }
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }
  // eslint-disable-next-line
  const transferMethod = connex.thor.account(addressContract).method(transferABI)
  console.log(amountEVM)
  const transferClause = transferMethod.asClause(toAddress, amountEVM)
  // eslint-disable-next-line
  const signingService = connex.vendor.sign('tx')
  signingService
    .signer(signerAddress) // Enforce signer
    .gas(200000) // Set maximum gas
    .comment('Token transfer: ' + amountHuman.toString() + ' ' + symbol)

  let transactionInfo = await signingService.request([
    {
      comment: 'Courtesy of VeChain-Token-Tranfer tool.',
      ...transferClause
    }
  ])
  return transactionInfo
}

/**
 * @returns {Boolean} Is on mainnet or testnet.
 */
async function isMainNet () {
  // eslint-disable-next-line
  return connex.thor.genesis.id === initData.MAIN_NET_ID 
}

export {
  getAccountBalance,
  getTokenBalance,
  transferToken,
  isMainNet
}

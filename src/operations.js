/**
 * Connex related operations.
 */
const semver = require('semver')
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
    // .gas(200000) // Set maximum gas
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
 * Transfer token in bulk manner from one to a lot of receivers.
 * @param {String} addressContract Contract address.
 * @param {String} signerAddress Enforce who signs the transaction.
 * @param {Array} receiverList Receivers of transfer. {amountEVM:String, toAddress:String, transferAmount:Number}
 * @param {String} symbol Symbol of the transferred token.
 */
async function transferTokenBulk (addressContract, signerAddress, receiverList, symbol) {
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
  const signingService = connex.vendor.sign('tx')
  signingService
    .signer(signerAddress) // Enforce signer
    // .gas(200000) // Set maximum gas
    .comment('Token transfer tool by laalaguer.')

  // eslint-disable-next-line
  const transferMethod = connex.thor.account(addressContract).method(transferABI)

  let transferClauses = []

  for (let i = 0; i < receiverList.length; i++) {
    let transferClause = transferMethod.asClause(receiverList[i].toAddress, receiverList[i].amountEVM)
    let comment = `To: ${receiverList[i].toAddress} Amount:${receiverList[i].transferAmount} ${symbol}`
    transferClauses.push({
      comment: comment,
      ...transferClause
    })
  }

  let transactionInfo = await signingService.request(transferClauses)
  return transactionInfo
}

/**
 * Transfer VET in bulk manner from one to a lot of receivers.
 * @param {String} signerAddress Enforce who signs the transaction.
 * @param {Array} receiverList Receivers of transfer. {amountEVM:String, toAddress:String, transferAmount:Number}
 * @param {String} symbol Symbol of the transferred token.
 */
async function transferVETBulk (signerAddress, receiverList, symbol) {
  // eslint-disable-next-line
  const signingService = connex.vendor.sign('tx')
  signingService
    .signer(signerAddress) // Enforce signer
    // .gas(200000) // Set maximum gas
    .comment('VET: Token transfer tool by laalaguer.')

  let transferClauses = []

  for (let i = 0; i < receiverList.length; i++) {
    let transferClause = { 'to': receiverList[i].toAddress, 'value': receiverList[i].amountEVM}
    let comment = `To: ${receiverList[i].toAddress} Amount:${receiverList[i].transferAmount} ${symbol}`
    transferClauses.push({
      comment: comment,
      ...transferClause
    })
  }

  let transactionInfo = await signingService.request(transferClauses)
  return transactionInfo
}

/**
 * @returns {Boolean} Is on mainnet or testnet.
 */
async function isMainNet () {
  // eslint-disable-next-line
  return connex.thor.genesis.id === initData.MAIN_NET_ID 
}

/**
 * Return if the address is owned by user in vendor in Connex environment.
 * @param {String} address The VET/ETH address that to be checked.
 */
function isOwned (address) {
  // eslint-disable-next-line
  if (semver.gte(connex.version, "1.2.2")) {
    // eslint-disable-next-line
    return connex.vendor.owned(address)
  } else {
    return true
  }
}

export {
  getAccountBalance,
  getTokenBalance,
  transferToken,
  transferTokenBulk,
  transferVETBulk,
  isMainNet,
  isOwned
}

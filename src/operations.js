/**
 * Connex related operations.
 */

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

export {
  getAccountBalance,
  getTokenBalance
}

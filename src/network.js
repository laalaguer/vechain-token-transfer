/**
 * Connex related network operations.
 */

const getAccountBalance = async function (address) {
  // eslint-disable-next-line
  const acc = connex.thor.account(address)
  const accInfo = await acc.get()
  return accInfo
}

// const getAccountBalance = function (address) {
//   // eslint-disable-next-line
//   const acc = connex.thor.account(address)
//   return acc.get()
// }

export {
  getAccountBalance
}

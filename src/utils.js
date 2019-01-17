/**
 * Utils related to number format.
 */

const BigNumber = require('bignumber.js')
const DECIMALS = new BigNumber(10 ** 18) // Decimals = 18 on VTHO and most contracts.

/**
 * Turn a string to big number.
 * @param {String} aString a number string.
 */
const makeBN = function (aString) {
  return BigNumber(aString)
}

/**
 * Turn a BigNumber into a printable string.
 * @param {BigNumer} aBigNumber A big number.
 * @param {Integer} dp An integer of percision, default is 2.
 */
const printBN = function (aBigNumber, dp = 2) {
  return aBigNumber.toFixed(dp)
}

/**
 * Turn an EVM big number into normal human understandable percision.
 * @param {BigNumber} aBigNumber An EVM big number.
 * @param {BigNumber} decimals Percisions that EVM number has. Default is 10 ** 18.
 */
const evmToHuman = function (aBigNumber, decimals = DECIMALS) {
  return aBigNumber.dividedBy(decimals)
}

/**
 * Turn a human understandable number to an EVM Big number.
 * @param {String} aNumber A normal float/int from user input.
 * @param {BigNumber} decimals Percisions that EVM number has. Default is 10 ** 18.
 * @returns {String} String represented number.
 */
const humanToEvm = function (aNumber, decimals = DECIMALS) {
  const a = makeBN(aNumber)
  return a.multipliedBy(decimals).toString(10)
}

/**
 * Shortcut turing EVM big number string into human readable short format.
 * @param {String} aString String representing the EVM big number.
 * @param {BigNumber} decimals EVM decimals that number has.
 * @param {BigNumber} dp decimal points that result shall keep.
 */
const evmToPrintable = function (aString, decimals = DECIMALS, dp = 2) {
  const evmNumber = makeBN(aString)
  const humanNumber = evmToHuman(evmNumber)
  return printBN(humanNumber, dp)
}

export {
  makeBN,
  printBN,
  evmToHuman,
  humanToEvm,
  evmToPrintable
}

/**
 * Utils related to number format.
 */

const BigNumber = require('bignumber.js')
const DECIMALS = function (points) {
  return new BigNumber(10 ** points) // Decimals = 18 on VTHO and most contracts.
}

/**
 * Turn a string to big number.
 * @param {String} aString a number string.
 */
const makeBN = function (aString) {
  return new BigNumber(aString)
}

/**
 * Turn a BigNumber into a printable string.
 * @param {BigNumer} aBigNumber A big number.
 * @param {Integer} dp An integer of percision, default is 2.
 */
const printBN = function (aBigNumber, dp = 2) {
  return aBigNumber.toFixed(dp, BigNumber.ROUND_DOWN)
}

/**
 * Turn an EVM big number into normal human understandable percision.
 * @param {BigNumber} aBigNumber An EVM big number.
 * @param {Number} decimals Percisions that EVM number has. Default is 18.
 * @returns {BigNumber}
 */
const evmToHuman = function (aBigNumber, decimals = 18) {
  return aBigNumber.dividedBy(DECIMALS(decimals))
}

/**
 * Turn a human understandable number to an EVM Big number.
 * @param {String} aNumber A normal float/int from user input.
 * @param {Number} decimals Percisions that EVM number has. Default is 18.
 * @returns {String} String represented number.
 */
const humanToEvm = function (aNumber, decimals = 18) {
  const a = makeBN(aNumber)
  return a.multipliedBy(DECIMALS(decimals)).toString(10)
}

/**
 * Shortcut turing EVM big number string into human readable short format.
 * @param {String} aString String representing the EVM big number.
 * @param {Number} decimals Percisions that EVM number has. Default is 18.
 * @param {BigNumber} dp decimal points that result shall keep.
 * @returns {String} a string representing the evm number by percesion.
 */
const evmToPrintable = function (aString, decimals = 18, dp = 2) {
  const evmNumber = makeBN(aString)
  const humanNumber = evmToHuman(evmNumber, decimals)
  return printBN(humanNumber, dp)
}

export {
  makeBN,
  printBN,
  evmToHuman,
  humanToEvm,
  evmToPrintable
}

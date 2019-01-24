/**
 * Storage options for persistant data.
 * Storage key is:
 *  version::typename::symbol::address
 *  version is the 1,2,3
 *  typename is 'address' or 'content', etc
 *  symbol is 'VTHO', 'TIC', etch
 *  address is '0xasdfasdfa'
 * Storage value is:
 *  true/false in string
 */

const separater = '::'
const version = '1'

/**
 * Set an address to storage.
 * @param {String} address address starts with 0x
 * @param {String} symbol symbol of token of address.
 * @param {Boolean} owned if user own this address.
 */
const setUnion = function (address, symbol, owned) {
  localStorage.setItem(
    [version, 'union', symbol, address].join(separater),
    owned.toString()
  )
}

/**
 * Remove a union.
 * @param {String} address address starts with 0x
 * @param {String} symbol symbol of token of address.
 */
const removeUnion = function (address, symbol) {
  localStorage.removeItem(
    [version, 'union', symbol, address].join(separater)
  )
}

/**
 * Get all unions in [{address, symbol}, {address, symbol}...] format.
 */
const getAllUnions = function () {
  let returnList = []
  for (let i in localStorage) {
    if (i.startsWith([version, 'union'].join(separater))) {
      const [, , mSymbol, mAddress] = i.split(separater)
      returnList.push({
        symbol: mSymbol,
        address: mAddress
      })
    }
  }

  return returnList
}

const setLanguage = function (name) {
  if (name) {
    localStorage.setItem(
      [version, 'language'].join(separater),
      name.toString()
    )
  }
}

const getLanguage = function () {
  const item = localStorage.getItem([version, 'language'].join(separater))
  return item
}

export {
  setUnion,
  removeUnion,
  getAllUnions,
  setLanguage,
  getLanguage
}

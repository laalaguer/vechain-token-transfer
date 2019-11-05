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
const version = '2';

/**
 * version 1:
 * 1::language 'value'
 * 1::union::BAG::0x49b39a0bfe03a6987ca3252dd2096515d1435ab1 'false'
 * here 'false' is if this address is owned by the user or not.
 */

/**
 * version 2:
 * 1::language 'value'
 * 2::union::BAG::0x49b39a0bfe03a6987ca3252dd2096515d1435ab1 'nickname'
 * or
 * 2::union::BAG::0x49b39a0bfe03a6987ca3252dd2096515d1435ab1 ''
 */

/** Storage migration from version 1 to version 2 */
(function () {
  for (let i in localStorage) {
    if (i.startsWith(['1', 'union'].join(separater))) {
      const [, , mSymbol, mAddress] = i.split(separater)
      localStorage.setItem(
        ['2', 'union', mSymbol, mAddress].join(separater),
        '' // empty nickname
      )
      localStorage.removeItem(i) // remove old data.
    }

    if (i.startsWith(['1', 'language'].join(separater))) {
      const value = localStorage.getItem(i.toString())
      localStorage.setItem(
        ['2', 'language'].join(separater),
        value
      )
      localStorage.removeItem(i) // remove old data.
    }
  }
}())

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
      const nickname = localStorage.getItem(i.toString())
      returnList.push({
        symbol: mSymbol,
        address: mAddress,
        nickname: nickname
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

// index should be int.
const setRememberedTabIndex = function (index) {
  localStorage.setItem(
    [version, 'tabIndex'].join(separater),
    index.toString()
  )
}

// 0 or any index.
const getRememberedTabIndex = function () {
  const item = localStorage.getItem([version, 'tabIndex'].join(separater))
  if (item === null) {
    return 0
  } else {
    return parseInt(item)
  }
}

export {
  setUnion,
  removeUnion,
  getAllUnions,
  setLanguage,
  getLanguage,
  setRememberedTabIndex,
  getRememberedTabIndex
}

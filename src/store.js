import Vue from 'vue'
import Vuex from 'vuex'
const myStorage = require('./storage.js')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isMainNet: null, // default to null, should be true/false.
    addressSymbolUnions: [] // {address, symbol} unions
  },
  getters: {
    addressSymbolUnions: function (state) {
      return state.addressSymbolUnions
    },
    isMainNet: function (state) {
      return state.isMainNet
    },
    themeVariant: function (state) {
      switch (state.isMainNet) {
        case true:
          return 'primary'
        case false:
          return 'warning'
        default:
          return 'danger'
      }
    }
  },
  // Sync methods.
  // Call by $store.commit('actionName', params)
  mutations: {
    addAddressSymbolUnion: function (state, { address, symbol }) {
      state.addressSymbolUnions.push({
        address: address,
        symbol: symbol
      })
    },
    removeAddressSymbolUnion: function (state, { address, symbol }) {
      let index = -1
      for (let i in state.addressSymbolUnions) {
        if (i.address === address && i.symbol === symbol) {
          index = i
          break
        }
      }
      if (index !== -1) {
        state.addressSymbolUnions.splice(index, 1)
      }
    },
    changeNetwork: function (state, isMainNet) {
      state.isMainNet = isMainNet
    }
  },
  // Async methods.
  // Call by $store.dispatch('actionName', params)
  actions: {
    setUnion ({ commit }, { address, symbol, owned }) {
      myStorage.setUnion(address, symbol, owned)
      commit('addAddressSymbolUnion', { address: address, symbol: symbol })
    },
    removeUnion ({ commit }, { address, symbol }) {
      myStorage.removeUnion(address, symbol)
      commit('removeAddressSymbolUnion', { address: address, symbol: symbol })
    },
    async populateUnions ({ commit }) {
      let unions = myStorage.getAllUnions()
      for (let i = 0; i < unions.length; i++) {
        commit('addAddressSymbolUnion', { address: unions[i].address, symbol: unions[i].symbol })
      }
    }
  }
})

import Vue from 'vue'
import Vuex from 'vuex'

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
    addAddressSymbolUnion: function (state, newAddress, relatedSymbol) {
      state.addressSymbolUnions.push({
        address: newAddress,
        symbol: relatedSymbol
      })
    },
    changeNetwork: function (state, isMainNet) {
      state.isMainNet = isMainNet
    }
  },
  // Async methods.
  // Call by $store.dispatch('actionName', params)
  actions: {

  }
})

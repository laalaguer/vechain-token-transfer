import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    addresses: []
  },
  getters: {
    addresses: function (state) {
      return state.addresses
    }
  },
  // Sync methods.
  // Call by $store.commit('actionName', params)
  mutations: {
    addAddress: function (state, newAddress) {
      if (state.addresses.indexOf(newAddress) === -1) {
        state.addresses.push(newAddress)
      }
    }
  },
  // Async methods.
  // Call by $store.dispatch('actionName', params)
  actions: {

  }
})

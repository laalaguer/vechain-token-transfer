<template>
  <b-container>
    <b-row>
      <b-col class="my-2 px-0" cols="12" v-for="unit in addressSymbolUnions" :key="unit.address">
        <transfer-card v-if="isContract" @removeAddress="removeAddress" :address="unit.address" :nickname="unit.nickname" :symbol="symbol" :contract="contractAddress" :decimals="decimals"/>
        <vet-transfer-card v-if="!isContract" @removeAddress="removeAddress" :address="unit.address" :symbol="symbol"/>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <input-area :contracts="contracts" @addaddress="addNewAddress" :symbol="symbol" :empty="addressSymbolUnions.length === 0"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import InputArea from './InputArea.vue'
import TransferCard from './TransferCard.vue'
import VetTransferCard from './VetTransferCard.vue'
import { GlobalEventBus } from '../events.js'

export default {
  props: {
    symbol: String,
    contractAddress: String,
    decimals: Number,
    contracts: Array
  },
  components: {
    InputArea,
    TransferCard,
    VetTransferCard
  },
  beforeMount () {
    this.syncAddressFromStore()
  },
  mounted () {
    GlobalEventBus.$on('ADDRESS_ADDED', (payload) => {
      if (payload.symbol === this.symbol) {
        let index = -1
        for (let i = 0; i < this.addressSymbolUnions.length ;i++){
          if (this.addressSymbolUnions[i]['address'] === payload.address){
            index = i
            break
          }
        }
        if (index === -1){ // new address!
          this.addressSymbolUnions.push({
            address: payload.address,
            symbol: this.symbol,
            nickname: payload.nickname
          })

        }
      }
    })
  },
  data () {
    return {
      addressSymbolUnions: []
    }
  },
  methods: {
    syncAddressFromStore () {
      let allAddresses = this.$store.getters.addressSymbolUnions
      for (let i = 0; i < allAddresses.length; i++) {
        if (allAddresses[i].symbol === this.symbol) {
          let index = -1
          for (let j = 0; j < this.addressSymbolUnions.length;j++){
            if (this.addressSymbolUnions[j]['address'] === allAddresses[i].address){
              index = j
              break
            }
          }
          if (index === -1){
            this.addressSymbolUnions.push({
              address: allAddresses[i].address,
              symbol: allAddresses[i].symbol,
              nickname: allAddresses[i].nickname
            })
          }
        }
      }
    },
    removeAddress (value) {
      let index = -1
      for (let i = 0; i < this.addressSymbolUnions.length ;i++){
        if (this.addressSymbolUnions[i]['address'] === value){
          index = i
          break
        }
      }
      if (index !== -1) {
        this.addressSymbolUnions.splice(index, 1)
        this.$store.dispatch('removeUnion', { address: value, symbol: this.symbol })
      }
    },
    addNewAddress (value, symbolsToWatch) {
      for (let i = 0; i < symbolsToWatch.length; i++) {
        // if symbol is of current tab, and address is new, push to local array
        if (symbolsToWatch[i] === this.symbol) {
          let index = -1
          for (let i = 0; i < this.addressSymbolUnions.length ;i++){
            if (this.addressSymbolUnions[i]['address'] === value){
              index = i
              break
            }
          }
          if (index === -1){ // new address!
            this.addressSymbolUnions.push({
              address: value,
              symbol: this.symbol,
              nickname: ''
            })

            this.$store.dispatch('setUnion', { address: value, symbol: symbolsToWatch[i], nickname: '' })
            GlobalEventBus.$emit('ADDRESS_ADDED', { address: value, symbol: symbolsToWatch[i], nickname: '' })
          }
        }
      }
    }
  },
  computed: {
    isContract () {
      return this.contractAddress !== ''
    }
  }
}
</script>

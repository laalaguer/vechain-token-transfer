<template>
  <b-container>
    <b-row>
      <b-col class="my-2 px-0" cols="12" v-for="address in addresses" :key="address">
        <transfer-card v-if="isContract" @removeAddress="removeAddress" :address="address" :symbol="symbol" :contract="contractAddress" :decimals="decimals"/>
        <vet-transfer-card v-if="!isContract" @removeAddress="removeAddress" :address="address" :symbol="symbol"/>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <input-area @addaddress="addNewAddress" :symbol="symbol" :empty="addresses.length === 0"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import InputArea from './InputArea.vue'
import TransferCard from './TransferCard.vue'
import VetTransferCard from './VetTransferCard.vue'

export default {
  props: {
    symbol: String,
    contractAddress: String,
    decimals: Number
  },
  components: {
    InputArea,
    TransferCard,
    VetTransferCard
  },
  beforeMount () {
    let allAddresses = this.$store.getters.addressSymbolUnions
    for (let i = 0; i < allAddresses.length; i++) {
      if (allAddresses[i].symbol === this.symbol) {
        this.addresses.push(allAddresses[i].address)
      }
    }
  },
  data () {
    return {
      addresses: []
    }
  },
  methods: {
    removeAddress (value) {
      let index = this.addresses.indexOf(value)
      if (index !== -1) {
        this.addresses.splice(index, 1)
        this.$store.dispatch('removeUnion', { address: value, symbol: this.symbol })
      }
    },
    addNewAddress (value) {
      if (this.addresses.indexOf(value) === -1) {
        this.addresses.push(value)
        this.$store.dispatch('setUnion', { address: value, symbol: this.symbol, owned: false })
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

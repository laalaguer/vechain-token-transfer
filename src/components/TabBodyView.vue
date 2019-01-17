<template>
  <b-container>
    <b-row>
      <b-col>
        <input-area @addaddress="addNewAddress" :symbol="symbol" :empty="addresses.length === 0"/>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="my-2" cols="12" v-for="address in addresses" :key="address">
        <transfer-card :address="address" :symbol="symbol" :contract="contractAddress" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import InputArea from './InputArea.vue'
import TransferCard from './TransferCard.vue'

export default {
  props: {
    symbol: String,
    contractAddress: String,
    decimals: Number
  },
  components: {
    InputArea,
    TransferCard
  },
  data () {
    return {
      addresses: []
    }
  },
  methods: {
    addNewAddress (value) {
      if (this.addresses.indexOf(value) === -1) {
        this.addresses.push(value)
      }
    }
  }
}
</script>

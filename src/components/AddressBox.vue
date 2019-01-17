<!-- Address Box, responsible for the address status -->
<template>
  <b-form-group
    :label="label"
    label-for="input-address"
    :invalid-feedback="invalidAddressFeedback"
    :valid-feedback="validAddressFeedback"
    :state="addressState"
    >
      <b-form-input
        id="input-address"
        :state="addressState"
        v-model.trim="address"
        v-on:change="boxChange"
      ></b-form-input>
  </b-form-group>
</template>

<script>
const calc = require('../calculations.js')

export default {
  props: {
    label: String
  },
  data () {
    return {
      address: '',
      validAddressFeedback: 'Looks good'
    }
  },
  methods: {
    boxChange () {
      if (this.addressState === true) {
        this.$emit('addressReady', this.address) // Pass address to parent.
      } else {
        this.$emit('addressNotReady')
      }
    },
    clearBox () {
      this.address = ''
    }
  },
  computed: {
    addressErrorCode () { // Error code of address
      if (!this.address.startsWith('0x')) {
        return 'ERR_START_WRONG'
      }
      if (this.address.length < 42) {
        return 'ERR_TOO_SHORT'
      }
      if (this.address.length > 42) {
        return 'ERR_TOO_LONG'
      }
      if (!calc.onlyAlphanumeric(this.address.slice(2))) {
        return 'ERR_NON_ALPHANUMERIC'
      }
      if (!calc.isValidAddress(this.address.slice(2))) {
        return 'ERR_INVALID_ADDRESS'
      }
      return null
    },
    addressState () { // The state of address input box.
      if (this.address.length === 0) {
        return null
      }
      if (this.addressErrorCode) {
        return false
      } else {
        return true
      }
    },
    invalidAddressFeedback () { // Input feedback message.
      switch (this.addressErrorCode) {
        case 'ERR_START_WRONG':
          return 'Should start with 0x'
        case 'ERR_TOO_SHORT':
          return 'Too short'
        case 'ERR_TOO_LONG':
          return 'Too long'
        case 'ERR_INVALID_ADDRESS':
          return 'Invalid Address or checksum failed'
        case 'ERR_NON_ALPHANUMERIC':
          return 'Only A-Z, a-z, 0-9 allowed'
        case 'ERR_CHECKSUM_FAILED':
          return 'Address checksum failed'
        default:
          return ''
      }
    }
  }
}
</script>

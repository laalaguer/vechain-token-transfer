<!-- Address Box, responsible for the address status -->
<template>
  <b-form-group
    :label="computedLabel"
    label-for="input-address"
    :invalid-feedback="invalidAddressFeedback"
    :valid-feedback="validAddressFeedback"
    :state="addressState"
    class="noselect"
    >
      <b-form-input
        id="input-address"
        :state="addressState"
        v-model.trim="address"
        v-on:update="boxChange"
        placeholder="0x..."
      ></b-form-input>
  </b-form-group>
</template>

<script>
const calc = require('../calculations.js')

export default {
  props: {
    label: String,
    uniqueID: String,
    forcedAddress: String
  },
  data () {
    return {
      address: ''
    }
  },
  beforeMount () {
    if (this.forcedAddress !== '') {
      this.address = this.forcedAddress
    }
  },
  methods: {
    boxChange () {
      if (this.addressState === true) {
        this.$emit('addressReady', this.address, this.uniqueID) // Pass address to parent.
      } else {
        this.$emit('addressNotReady', this.uniqueID)
      }
    },
    clearBox () {
      this.address = ''
    }
  },
  computed: {
    computedLabel () {
      if (this.address === '') {
        return this.label
      }
      return this.label + ' ' + this.address.slice(0, 7) + '...' + this.address.slice(-7)
    },
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
          return this.$t('addressBox.ERR_START_WRONG')
        case 'ERR_TOO_SHORT':
          return this.$t('addressBox.ERR_TOO_SHORT')
        case 'ERR_TOO_LONG':
          return this.$t('addressBox.ERR_TOO_LONG')
        case 'ERR_INVALID_ADDRESS':
          return this.$t('addressBox.ERR_INVALID_ADDRESS')
        case 'ERR_NON_ALPHANUMERIC':
          return this.$t('addressBox.ERR_NON_ALPHANUMERIC')
        case 'ERR_CHECKSUM_FAILED':
          return this.$t('addressBox.ERR_CHECKSUM_FAILED')
        default:
          return ''
      }
    },
    validAddressFeedback () {
      return this.$t('addressBox.validAddressFeedback')
    }
  }
}
</script>

<style>
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
</style>

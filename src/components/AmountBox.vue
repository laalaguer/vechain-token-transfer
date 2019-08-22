<!-- Amount Box, responsible for amount input status -->
<template>
  <b-form-group
    :label="computedLabel"
    label-for="input-amount"
    :invalid-feedback="invalidAmountFeedback"
    :valid-feedback="validAmountFeedback"
    :state="showState"
    class="noselect"
  >
    <b-input-group :append="symbol">
      <b-form-input
        id="input-amount"
        type="number"
        min="0"
        :state="showState"
        v-model.number="amount"
        v-on:change="boxChange">
      </b-form-input>
    </b-input-group>
  </b-form-group>
</template>

<script>
export default {
  props: {
    label: String,
    symbol: String,
    breachedMax: Boolean,
    uniqueID: String,
    forcedAmount: Number
  },
  data () {
    return {
      amount: 0
    }
  },
  beforeMount () {
    if (this.forcedAmount !== 0) {
      this.amount = this.forcedAmount
    }
  },
  methods: {
    boxChange () {
      if (this.amountState === true) {
        this.$emit('amountReady', this.amount, this.uniqueID) // Pass amount to parent when it is a valid number.
      } else {
        this.$emit('amountNotReady', this.uniqueID)
      }
    },
    clearBox () {
      this.amount = 0
    }
  },
  computed: {
    showState () {
      if (this.breachedMax) {
        return false
      } else {
        return this.amountState
      }
    },
    computedLabel () {
      if (this.amount === 0) {
        return '...'
      } else if (this.amount === '') {
        return '...'
      } else {
        return this.amount.toString()
      }
    },
    amountErrorCode () { // Error code generated from the input number.
      if (isNaN(this.amount)) {
        return 'ERR_NAN'
      }
      if (this.amount === 0) {
        return 'ERR_ZERO'
      }
      if (this.amount < 0) {
        return 'ERR_NEGATIVE'
      }
      if (this.breachedMax) {
        return 'ERR_BREACH_MAX'
      }
      const p = /^[0-9]+.?[0-9]{0,4}$/
      if (!this.amount.toString().match(p)) {
        return 'ERR_DECIMAL_FORMAT'
      }
      return null
    },
    amountState () { // if amount is a valid number state.
      switch (this.amountErrorCode) {
        case 'ERR_ZERO':
          return null
        case 'ERR_NAN':
        case 'ERR_NEGATIVE':
        case 'ERR_DECIMAL_FORMAT':
          return false
        case 'ERR_BREACH_MAX':
        default:
          return true
      }
    },
    invalidAmountFeedback () {
      switch (this.amountErrorCode) {
        case 'ERR_ZERO':
          return this.$t('amountBox.ERR_ZERO')
        case 'ERR_NAN':
          return this.$t('amountBox.ERR_NAN')
        case 'ERR_NEGATIVE':
          return this.$t('amountBox.ERR_NEGATIVE')
        case 'ERR_BREACH_MAX':
          return this.$t('amountBox.ERR_BREACH_MAX')
        case 'ERR_DECIMAL_FORMAT':
          return this.$t('amountBox.ERR_DECIMAL_FORMAT')
        default:
          return ''
      }
    },
    validAmountFeedback () {
      return this.$t('amountBox.validAmountFeedback')
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

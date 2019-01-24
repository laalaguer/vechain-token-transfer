<!-- Amount Box, responsible for amount input status -->
<template>
  <b-form-group
    :label="label"
    label-for="input-amount"
    :invalid-feedback="invalidAmountFeedback"
    :valid-feedback="validAmountFeedback"
    :state="amountState"
    class="noselect"
  >
    <b-input-group :append="symbol">
      <b-form-input
        id="input-amount"
        type="number"
        min="0"
        :state="amountState"
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
    maxValue: Number
  },
  data () {
    return {
      amount: 0
    }
  },
  methods: {
    boxChange () {
      if (this.amountState === true) {
        this.$emit('amountReady', this.amount) // Pass amount to parent.
      } else {
        this.$emit('amountNotReady')
      }
    },
    clearBox () {
      this.amount = 0
    }
  },
  computed: {
    amountErrorCode () { // Error code of amount
      if (isNaN(this.amount)) {
        return 'ERR_NAN'
      }
      if (this.amount === 0) {
        return 'ERR_ZERO'
      }
      if (this.amount < 0) {
        return 'ERR_NEGATIVE'
      }
      if (this.amount > this.maxValue) {
        return 'ERR_BREACH_MAX'
      }
      const p = /^[0-9]+.?[0-9]{0,4}$/
      if (!this.amount.toString().match(p)) {
        return 'ERR_DECIMAL_FORMAT'
      }
      return null
    },
    amountState () {
      switch (this.amountErrorCode) {
        case 'ERR_ZERO':
          return null
        case 'ERR_NAN':
        case 'ERR_NEGATIVE':
        case 'ERR_BREACH_MAX':
        case 'ERR_DECIMAL_FORMAT':
          return false
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

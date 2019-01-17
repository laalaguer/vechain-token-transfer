<!-- Amount Box, responsible for amount input status -->
<template>
  <b-form-group
    :label="label"
    label-for="input-amount"
    :invalid-feedback="invalidAmountFeedback"
    :valid-feedback="validAmountFeedback"
    :state="amountState"
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
      amount: 0,
      validAmountFeedback: 'Looks good'
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
          return 'Cannot be 0'
        case 'ERR_NAN':
          return 'Must be a number'
        case 'ERR_NEGATIVE':
          return 'Must be positive'
        case 'ERR_BREACH_MAX':
          return 'Too large'
        case 'ERR_DECIMAL_FORMAT':
          return 'Max 4 decimal digits allowed'
        default:
          return ''
      }
    }
  }
}
</script>

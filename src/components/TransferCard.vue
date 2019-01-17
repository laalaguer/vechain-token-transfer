<!-- Card: Responsible for transferring token -->
<template>
  <div>
    <b-card border-variant="border" class="shadow-sm">
      <b-row><!-- Row of info display -->
        <b-col cols="6">
          <p v-b-tooltip.hover :title="address">{{truncatedAddress}}</p>
        </b-col>
        <b-col cols="5">
          <p class="margin-none"><span class="text-primary">{{tokenValue}}</span> {{symbol}}</p>
          <p class="margin-none"><span class="text-danger">{{vthoValue}}</span> VTHO</p>
        </b-col>
        <b-col cols="1">
          <font-awesome-icon @click="toggleShowOffButton" :icon="['fas', arrowChoice]" />
        </b-col>
      </b-row>

    <b-collapse v-model="showCollapseOfTransfer" id="collapse-transfer">
      <b-row><!-- Row of Address -->
        <b-col cols="12">
          <b-form-group
            :label="transferToAddressTitle"
            label-for="input-address"
            :invalid-feedback="invalidAddressFeedback"
            :valid-feedback="validAddressFeedback"
            :state="toAddressState"
            >
              <b-form-input
                id="input-address"
                :state="toAddressState"
                v-model.trim="toAddress"
              ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row><!-- Row of Amount -->
        <b-col cols="12">
          <b-form-group
            :label="transferAmountTitle"
            label-for="input-amount"
            :invalid-feedback="invalidAmountFeedback"
            :valid-feedback="validAmountFeedback"
            :state="transferAmountState"
          >
            <b-input-group :append="symbol">
              <b-form-input
                id="input-amount"
                type="number"
                min="0"
                :max="maxTransferAllowed"
                :state="transferAmountState"
                v-model.number="transferAmount">
              </b-form-input>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row style="text-align: center;">
        <b-col cols="12">
          <b-button variant="primary" @click="createTransfer">{{createTransferButton}}</b-button>
        </b-col>
      </b-row>

    </b-collapse>

    <b-collapse v-model="showCollapseOfConfirmation" id="collapse-confirmation">
      <div>
        <p>{{transferToAddressTitle}}</p>
        <p>{{toAddress}}</p>
        <p>{{transferAmountTitle}}</p>
        <p>{{transferAmount}} {{symbol}}</p>
      </div>
      <b-row style="text-align: center;">
        <b-col cols="6">
          <b-button variant="primary" @click="confirmTransfer">{{confirmTransferButton}}</b-button>
        </b-col>
        <b-col cols="6">
          <b-button @click="cancelTransfer">{{cancelTransferButton}}</b-button>
        </b-col>
      </b-row>
    </b-collapse>
    </b-card>

    <b-modal
      ref="transferResultModal"
      size="sm"
      centered
      hide-header-close
      hide-header
      ok-only
      :ok-title="modalOkButtonText"
      @ok="handleModalOk">
      {{modalText}}
    </b-modal><!-- Enter new address modal -->

  </div>
</template>

<script>
const calc = require('../calculations.js')
const operations = require('../operations.js')
const utils = require('../utils.js')

export default {
  props: {
    address: String, // Address of token holder.
    symbol: String, // Symbol of token.
    contract: String // Contract address.
  },
  data () {
    return {
      vthoValue: 0, // How many energy this address has.
      tokenValue: 0, // How many tokens this address has.
      showCollapseOfTransfer: false,
      showCollapseOfConfirmation: false,
      transferToAddressTitle: 'To:',
      toAddress: '',
      validAddressFeedback: 'Looks good.',
      transferAmount: 0,
      transferAmountTitle: 'Amount:',
      validAmountFeedback: 'Looks good.',
      createTransferButton: 'Next Step',
      confirmTransferButton: 'Confirm',
      cancelTransferButton: 'Cancel',
      modalText: '',
      modalOkButtonText: 'Okay',
      arrowChoice: 'angle-double-down'
    }
  },
  mounted () {
    this.hideAllCollapse()
    this.clearTransferData()
    this.refreshVTHOBalance()
    this.refreshTokenBalance()
  },
  methods: {
    clearTransferData () { // clear transfer data inside card.
      this.toAddress = ''
      this.transferAmount = 0
    },
    refreshTokenBalance () {
      operations.getTokenBalance(this.contract, this.address)
        .then(result => {
          this.tokenValue = utils.evmToPrintable(result['decoded']['balance'])
          // this will result in a Promise with undefined as resolve(value).
        })
        .then(() => {
          // eslint-disable-next-line
          const ticker = connex.thor.ticker()
          ticker.next().then().then(() => { this.refreshTokenBalance() })
        })
        .catch(e => {
          setTimeout(() => { this.refreshTokenBalance() }, 3000)
        })
    },
    refreshVTHOBalance () {
      // Refresh user vtho balance
      operations.getAccountBalance(this.address)
        .then(result => {
          this.vthoValue = utils.evmToPrintable(result['energy'])
          // this will result in a Promise with undefined as resolve(value).
        })
        .then(() => {
          // eslint-disable-next-line
          const ticker = connex.thor.ticker()
          ticker.next().then().then(() => { this.refreshVTHOBalance() })
        })
        .catch(e => { setTimeout(() => { this.refreshVTHOBalance() }, 3000) })
    },
    setModalText (text) {
      this.modalText = text
    },
    showModal () {
      this.$refs.transferResultModal.show()
    },
    hideModal () {
      this.$refs.transferResultModal.hide()
    },
    showConfirmationHideTransfer () {
      this.showCollapseOfTransfer = false
      this.showCollapseOfConfirmation = true
    },
    showTransferHideConfirmation () {
      this.showCollapseOfTransfer = true
      this.showCollapseOfConfirmation = false
    },
    hideAllCollapse () {
      this.showCollapseOfTransfer = false
      this.showCollapseOfConfirmation = false
    },
    toggleArrowIcon () {
      if (this.arrowChoice === 'angle-double-down') {
        this.arrowChoice = 'angle-double-up'
      } else {
        this.arrowChoice = 'angle-double-down'
      }
    },
    toggleShowOffButton () {
      this.toggleArrowIcon()
      this.clearTransferData()
      if (this.showCollapseOfTransfer || this.showCollapseOfConfirmation) {
        this.hideAllCollapse()
      } else {
        this.showTransferHideConfirmation()
      }
    },
    createTransfer () { // Create a transfer, not sending out yet.
      if (this.canTransfer) {
        this.showConfirmationHideTransfer()
      }
    },
    confirmTransfer () { // Confrim and send out a transfer.
      const evmAmount = utils.humanToEvm(this.transferAmount.toString())
      operations.transferToken(this.contract, this.address, this.toAddress, evmAmount, this.transferAmount, this.symbol)
        .then(result => {
          this.setModalText('Transaction sent!')
          this.showModal()
        })
        .catch(e => {
          this.setModalText(e.toString())
          console.trace(e)
          this.showModal()
        })
    },
    cancelTransfer () {
      this.showTransferHideConfirmation()
    },
    handleModalOk () {
      this.clearTransferData()
      this.hideAllCollapse()
      this.hideModal()
      this.toggleArrowIcon()
    }
  },
  computed: {
    addressErrorCode () { // Error code of address
      if (!this.toAddress.startsWith('0x')) {
        return 'ERR_START_WRONG'
      }
      if (this.toAddress.length < 42) {
        return 'ERR_TOO_SHORT'
      }
      if (this.toAddress.length > 42) {
        return 'ERR_TOO_LONG'
      }
      if (!calc.onlyAlphanumeric(this.toAddress.slice(2))) {
        return 'ERR_NON_ALPHANUMERIC'
      }
      if (!calc.isValidAddress(this.toAddress.slice(2))) {
        return 'ERR_INVALID_ADDRESS'
      }
      return null
    },
    amountErrorCode () { // Error code of amount
      if (isNaN(this.transferAmount)) {
        return 'ERR_NAN'
      }
      if (this.transferAmount === 0) {
        return 'ERR_ZERO'
      }
      if (this.transferAmount < 0) {
        return 'ERR_NEGATIVE'
      }
      if (this.transferAmount > this.tokenValue) {
        return 'ERR_BREACH_MAX'
      }
      const p = /^[0-9]+.?[0-9]{0,4}$/
      if (!this.transferAmount.toString().match(p)) {
        return 'ERR_DECIMAL_FORMAT'
      }
      return null
    },
    truncatedAddress () {
      return this.address.slice(0, 8) + '...' + this.address.slice(-6)
    },
    maxTransferAllowed () {
      return this.tokenValue
    },
    transferAmountState () {
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
    toAddressState () { // The state of address input box.
      if (this.toAddress.length === 0) {
        return null
      }
      if (this.addressErrorCode) {
        return false
      } else {
        return true
      }
    },
    canTransfer () {
      if (this.transferAmountState && this.toAddressState) {
        return true
      } else {
        return false
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

<style>
.margin-none {
  margin-bottom: 0;
  margin-top: 0;
}

</style>

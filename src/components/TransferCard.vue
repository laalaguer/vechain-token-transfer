<!-- Card: Responsible for transferring token -->
<template>
  <div>
    <b-card>
      <b-row><!-- Row of info display -->
        <b-col cols="7">
          <p class="trim-text">{{address}}</p>
        </b-col>
        <b-col cols="4">
          <p class="margin-none"><span class="text-primary">123.13</span> {{symbol}}</p>
          <p class="margin-none"><span class="text-danger">{{vthoValue}}</span> VTHO</p>
        </b-col>
        <b-col cols="1">
          <p @click="toggleShowOffButton">x</p>
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
        <p>{{transactionFeeTitle}}</p>
        <p>000.00 VTHO</p>
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
const network = require('../network.js')

export default {
  props: {
    address: String,
    symbol: String
  },
  data () {
    return {
      vthoValue: 0,
      amountOwned: 100, // Amount of token that owned by address.
      showCollapseOfTransfer: false,
      showCollapseOfConfirmation: false,
      transferToAddressTitle: 'To:',
      toAddress: '',
      validAddressFeedback: 'Looks good.',
      transferAmount: 0,
      transferAmountTitle: 'Amount:',
      invalidAmountFeedback: 'Must be positive.',
      validAmountFeedback: 'Looks good.',
      createTransferButton: 'Next Step',
      transactionFeeTitle: 'Fee',
      confirmTransferButton: 'Confirm',
      cancelTransferButton: 'Cancel',
      modalText: '',
      modalOkButtonText: 'Okay'
    }
  },
  mounted () {
    this.hideAllCollapse()
    let accInfo = network.getAccountBalance(this.address)
    debugger
    console.log(accInfo)
  },
  methods: {
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
    toggleShowOffButton () {
      if (this.showCollapseOfTransfer || this.showCollapseOfConfirmation) {
        this.hideAllCollapse()
      } else {
        this.showTransferHideConfirmation()
      }
    },
    createTransfer () { // Create a transfer, not sending out yet.
      this.showConfirmationHideTransfer()
    },
    confirmTransfer () {
      this.setModalText('Transaction sent!')
      this.showModal()
    },
    cancelTransfer () {
      this.showTransferHideConfirmation()
    },
    handleModalOk () {
      this.hideModal()
    }
  },
  computed: {
    maxTransferAllowed () {
      return this.amountOwned
    },
    transferAmountState () {
      if (this.transferAmount === 0) {
        return null
      }
      return this.transferAmount > 0 && this.transferAmount <= this.amountOwned
    },
    toAddressState () { // The state of input box.
      if (this.toAddress.length === 0) {
        return null
      }
      return calc.isValidAddress(this.toAddress.slice(2))
    },
    invalidAddressFeedback () { // Input feedback message.
      if (!this.toAddress.startsWith('0x')) {
        return 'Should start with 0x'
      }
      if (this.toAddress.length < 42) {
        return 'Too short.'
      } else if (this.toAddress.length > 42) {
        return 'Too long.'
      } else {
        if (!calc.isValidAddress(this.toAddress.slice(2))) {
          if (!calc.onlyAlphanumeric(this.toAddress.slice(2))) {
            return 'Only A-Z, a-z, 0-9 allowed.'
          }
          if (!calc.isEIP55Address(this.toAddress.slice(2))) {
            return 'Address checksum failed.'
          }
        } else {
          return ''
        }
      }
      return null
    }
  }
}
</script>

<style>
.trim-text {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.margin-none {
  margin-bottom: 0;
  margin-top: 0;
}

</style>

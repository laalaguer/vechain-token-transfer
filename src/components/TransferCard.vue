<!-- Card: Responsible for transferring token -->
<template>
  <div>
    <b-card @mouseenter="imFocused" @mouseleave="imUnFocused" :border-variant="borderChoice" :class="[shadowChoice, 'bg-light']">
      <!-- Row of address and tokens it holds -->
      <b-row align-v="center">
        <b-col cols="1">
          <avatar :address="address" my-height="16px" my-width="16px"/>
        </b-col>
        <b-col cols="4">
          <h6 class="mt-2 cursor-default" ref="exh6" @click="copySourceAddress">
            {{truncatedAddress}}
          </h6>
          <b-tooltip :target="() => $refs.exh6" placement="left">
            {{address}}
          </b-tooltip>
        </b-col>
        <b-col cols="1" @click="showDeleteAddressModal">
          <font-awesome-icon class="trash-icon" :icon="['fas', 'trash']" />
        </b-col>
        <b-col cols="4" @click="toggleShowOffButton" class="show-hand">
          <p class="margin-none"><span class="text-primary">{{tokenValue}}</span> {{symbol}}</p>
          <p class="margin-none"><span class="text-danger">{{vthoValue}}</span> VTHO</p>
        </b-col>
        <b-col cols="2" @click="toggleShowOffButton">
          <b-button style="width: 80px" v-if="showTransferButton" variant="link" size="sm">{{transferText}}</b-button>
          <b-button style="width: 80px" v-if="!showTransferButton" variant="link" size="sm"><font-awesome-icon v-if="!showTransferButton" :icon="['fas', 'angle-double-up']"/></b-button>
        </b-col>
      </b-row>

    <!-- Collapse: Area of transfer data input -->
    <b-collapse v-model="showCollapseOfTransfer" id="collapse-transfer">
      <b-row><!-- Row of Address -->
        <b-col cols="12">
          <address-box
            ref="myAddressBox"
            :label="toAddressTitle"
            @addressReady="handleAddressReady"
            @addressNotReady="handleAddressNotReady"
          />
        </b-col>
      </b-row>

      <b-row><!-- Row of Amount -->
        <b-col cols="12">
          <amount-box
            ref="myAmountBox"
            :label="transferAmountTitle"
            :symbol="symbol"
            :maxValue="maxTransferAllowed"
            @amountReady="handleAmountReady"
            @amountNotReady="handleAmountNotReady"
          />
        </b-col>
      </b-row>

      <b-row style="text-align: center;">
        <b-col cols="12">
          <b-button variant="primary" @click="createTransfer">{{createTransferButton}}</b-button>
        </b-col>
      </b-row>

    </b-collapse>

    <!-- Collapse: Area of transfer confirmation information -->
    <b-collapse v-model="showCollapseOfConfirmation" id="collapse-confirmation">
      <div>
        <p>{{toAddressTitle}}</p>
        <p>{{toAddress}}</p>
        <p>{{transferAmountTitle}}</p>
        <p>{{transferAmount}} {{symbol}}</p>
        <p class="text-warning" v-if="this.$store.getters.isMainNet">{{mainNetWarning}}</p>
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

    <!-- Transfer result modal -->
    <b-modal
      ref="transferResultModal"
      centered
      hide-header-close
      hide-header
      ok-only
      :ok-title="modalOkButtonText"
      @ok="handleTransferFail">
      {{modalText}}
    </b-modal>

    <b-modal
      ref="deleteAddressModal"
      centered
      hide-header-close
      :title="deleteAddressModalTitle"
      :ok-title="modalOkButtonText"
      @ok="handleDeleteAddressOk"
      :cancel-title="modalCancelButtonText">
      {{address}}
    </b-modal>

  </div>
</template>

<script>
import AddressBox from './AddressBox.vue'
import AmountBox from './AmountBox.vue'
import Avatar from './Avatar.vue'
import copy from 'copy-to-clipboard'

const operations = require('../operations.js')
const utils = require('../utils.js')

export default {
  props: {
    address: String, // Address of token holder.
    symbol: String, // Symbol of token.
    contract: String, // Contract address.
    decimals: Number // Contract decimals setting.
  },
  components: {
    AddressBox,
    AmountBox,
    Avatar
  },
  data () {
    return {
      vthoValue: 0, // How many energy this address has, is a String type.
      tokenValue: 0, // How many tokens this address has, is a String type.
      showCollapseOfTransfer: false,
      showCollapseOfConfirmation: false,
      toAddress: '',
      transferAmount: 0,
      modalText: '',
      borderChoice: 'border',
      shadowChoice: 'shadow-sm',
      opacityChoice: 'half-dim',
      showTransferButton: true
    }
  },
  beforeMount () {
    this.refreshTokenBalance()
    this.refreshVTHOBalance()
  },
  mounted () {
    this.hideAllCollapse()
    this.clearTransferData()
  },
  methods: {
    handleDeleteAddressOk () {
      this.removeAddress()
    },
    removeAddress () {
      this.$emit('removeAddress', this.address)
    },
    copySourceAddress () {
      copy(this.address)
      this.$toasted.show(this.copyAddressToastText, {
        theme: 'toasted-primary',
        position: 'bottom-center',
        duration: 500
      })
    },
    imFocused () {
      // this.borderChoice = 'border border-' + this.$store.getters.themeVariant
      this.shadowChoice = 'shadow'
      this.opacityChoice = 'full'
    },
    imUnFocused () {
      this.borderChoice = 'border'
      this.shadowChoice = 'shadow-sm'
      this.opacityChoice = 'half-dim'
    },
    handleAddressReady (value) {
      this.toAddress = value
    },
    handleAddressNotReady () {
      this.toAddress = ''
    },
    handleAmountReady (value) {
      this.transferAmount = value
    },
    handleAmountNotReady () {
      this.transferAmount = 0
    },
    clearTransferData () { // clear transfer data inside card.
      this.toAddress = ''
      this.$refs.myAddressBox.clearBox()
      this.transferAmount = 0
      this.$refs.myAmountBox.clearBox()
    },
    refreshTokenBalance () {
      operations.getTokenBalance(this.contract, this.address)
        .then(result => {
          this.tokenValue = utils.evmToPrintable(result['decoded']['balance'], this.decimals)
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
          this.vthoValue = utils.evmToPrintable(result['energy'], this.decimals)
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
    showDeleteAddressModal () {
      this.$refs.deleteAddressModal.show()
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
    toggleTransferButton () {
      this.showTransferButton = !this.showTransferButton
    },
    toggleShowOffButton () {
      this.toggleTransferButton()
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
      const evmAmount = utils.humanToEvm(this.transferAmount.toString(), this.decimals)
      operations.transferToken(this.contract, this.address, this.toAddress, evmAmount, this.transferAmount, this.symbol)
        .then(result => {
          this.handleTransferOk()
          this.$toasted.show(this.transactionSent, {
            theme: 'toasted-primary',
            position: 'bottom-center',
            duration: 3000
          })
        })
        .catch(e => {
          this.setModalText(e.toString())
          this.showModal()
        })
    },
    cancelTransfer () {
      this.showTransferHideConfirmation()
    },
    handleTransferOk () {
      this.clearTransferData()
      this.hideAllCollapse()
      this.hideModal()
      this.toggleTransferButton()
    },
    handleTransferFail () {
      // this.clearTransferData()
      // this.hideAllCollapse()
      this.hideModal()
      // this.toggleTransferButton()
    }
  },
  computed: {
    truncatedAddress () {
      return this.address.slice(0, 6) + '...' + this.address.slice(-5)
    },
    maxTransferAllowed () {
      return parseFloat(this.tokenValue)
    },
    canTransfer () {
      return (this.transferAmount !== 0) && (this.toAddress !== '')
    },
    transferText () { return this.$t('transferCard.transferText') },
    toAddressTitle () { return this.$t('transferCard.toAddressTitle') },
    transferAmountTitle () { return this.$t('transferCard.transferAmountTitle') },
    createTransferButton () { return this.$t('transferCard.createTransferButton') },
    confirmTransferButton () { return this.$t('transferCard.confirmTransferButton') },
    cancelTransferButton () { return this.$t('transferCard.cancelTransferButton') },
    modalOkButtonText () { return this.$t('transferCard.modalOkButtonText') },
    modalCancelButtonText () { return this.$t('transferCard.modalCancelButtonText') },
    deleteAddressModalTitle () { return this.$t('transferCard.deleteAddressModalTitle') },
    copyAddressToastText () { return this.$t('transferCard.copyAddressToastText') },
    mainNetWarning () { return this.$t('transferCard.mainNetWarning') },
    transactionSent () { return this.$t('transferCard.transactionSent') }
  }
}
</script>

<style>
.margin-none {
  margin-bottom: 0;
  margin-top: 0;
}

.half-dim {
  opacity: 0.5;
}

.full {
  opacity: 1.0;
}

.trash-icon {
  color: salmon;
}

.trash-icon:hover {
  opacity: 1.0;
}

.trash-icon:not(:hover){
  opacity: 0.3;
}

.show-hand {
  cursor: pointer;
}

.cursor-default {
  cursor: default;
}
</style>

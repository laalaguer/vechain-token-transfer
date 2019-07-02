<!-- Card: Responsible for transferring token -->
<template>
  <div>
    <b-card @mouseenter="imFocused" @mouseleave="imUnFocused" :border-variant="borderChoice" :class="[shadowChoice, 'bg-light']">
      <!-- Row of address and tokens it holds -->
      <b-row align-v="center">
        <b-col cols="1">
          <avatar :address="address" my-height="16px" my-width="16px"/>
        </b-col>
        <b-col cols="3">
          <p ref="exh6" class="margin-none cursor-default" @click="copySourceAddress">{{truncatedAddress}}</p>
          <b-tooltip :target="() => $refs.exh6" placement="top">
            {{copyText + " " +address}}
          </b-tooltip>
        </b-col>
        <b-col cols="1">
          <font-awesome-icon class="trash-icon" :icon="['fas', 'trash']" @click="showDeleteAddressModal"/>
        </b-col>
        <b-col cols="4">
          <p class="margin-none text-right"><span class="text-primary">{{tokenValue}}</span> {{symbol}}</p>
        </b-col>
        <b-col cols="3" v-if="isOwned" @click="toggleShowOffButton">
          <b-button v-if="showTransferButton" variant="outline-primary" size="sm">
            {{transferText}}
          </b-button>
          <b-button v-if="!showTransferButton" variant="link" size="sm">
            <font-awesome-icon v-if="!showTransferButton" :icon="['fas', 'angle-double-up']"/>
          </b-button>
        </b-col>
        <b-col cols="3" v-if="!isOwned">
          <b-button variant="outline-danger" size="sm" @click="openWallets">
            {{addWalletText}}
          </b-button>
        </b-col>
      </b-row>

    <!-- Collapse: Area of transfer data input -->
    <b-collapse class="mt-3" v-model="showCollapseOfTransfer" id="collapse-transfer">
      <b-row v-for="item in receiverList" :key="item.uniqueID"><!-- Row of Address && Amount-->
        <b-col cols="6">
          <address-box
            :label="toAddressTitle"
            :uniqueID="item.uniqueID"
            @addressReady="handleAddressReady"
            @addressNotReady="handleAddressNotReady"
          />
        </b-col>
        <b-col cols="5" class="pl-0">
          <amount-box
            :label="transferAmountTitle"
            :uniqueID="item.uniqueID"
            :symbol="symbol"
            :breachedMax="isBreachedMax"
            @amountReady="handleAmountReady"
            @amountNotReady="handleAmountNotReady"
          />
        </b-col>
        <b-col cols="1">
          <b-form-group
            label=" "
            label-for="ban-icon"
            class="noselect py-3"
            >
            <font-awesome-icon id="ban-icon" :icon="['fas', 'ban']" @click="deleteReceiver(item.uniqueID)"/>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="4">
          <p @click="addAReceiver"><font-awesome-icon id="plus-icon" :icon="['fas', 'plus-circle']"/> {{ addAnotherReceiverText }}</p>
        </b-col>
        <b-col cols="8" style="text-align: center;">
          <p>{{transferAmountTitle}} <span class="font-weight-bold">{{totalTransferAmount}}</span> </p>
        </b-col>
      </b-row>

      <b-row style="text-align: center;">
        <b-col cols="12">
          <b-button variant="primary" @click="createTransfer">{{ createTransferButton }}</b-button>
        </b-col>
      </b-row>

    </b-collapse>

    <!-- Collapse: Area of transfer confirmation information -->
    <b-collapse v-model="showCollapseOfConfirmation" id="collapse-confirmation">
      <div class="mt-3">
        <h5>{{toAddressTitle}}</h5>
      </div>
      <div v-for="item in receiverList" :key="item.uniqueID">
        <b-row style="text-align: center;">
          <b-col cols="8">
            <p>{{item.toAddress}}</p>
          </b-col>
          <b-col cols="4">
             <p>{{item.transferAmount}}</p>
          </b-col>
        </b-row>
      </div>
      <div class="mt-1">
        <h5>{{transferAmountTitle}}</h5>
        <b-row style="text-align: center;">
          <b-col cols="8">
            <p> </p>
          </b-col>
          <b-col cols="4">
             <p>{{totalTransferAmount}} {{symbol}}</p>
          </b-col>
        </b-row>
        
        <p class="text-danger" v-if="this.$store.getters.isMainNet">{{mainNetWarning}}</p>
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
const randomBytes = require('randombytes')

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
      receiverList: [],
      modalText: '',
      borderChoice: 'border',
      shadowChoice: 'shadow-sm',
      opacityChoice: 'half-dim',
      showTransferButton: true,
      isOwned: false // if self is owned address
    }
  },
  beforeMount () {
    this.refreshTokenBalance()
    this.refreshVTHOBalance()
    this.refreshIsOwned()
    this.addAReceiver()
  },
  mounted () {
    this.hideAllCollapse()
    this.clearTransferData()
  },
  methods: {
    deleteReceiver (uniqueID) {
      let position = -1
      for (let i = 0; i < this.receiverList.length; i++) {
        if (this.receiverList[i].uniqueID === uniqueID) {
          position = i
          break
        }
      }

      if (position != -1){
        this.receiverList.splice(position, 1)
      }
    },
    addAReceiver () {
      this.receiverList.push(
        {
          uniqueID: randomBytes(7).toString('hex'),
          toAddress: '',
          transferAmount: 0,
          isReady: true,
          hasTouched: false // if this element is fresh, or has been touched.
        }
      )
    },
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
    handleAddressReady (value, uniqueID) {
      for (let i = 0; i < this.receiverList.length; i++) {
        if (this.receiverList[i].uniqueID === uniqueID) {
          this.receiverList[i].toAddress = value
          this.receiverList[i].hasTouched = true
        }
      }
    },
    handleAddressNotReady (uniqueID) {
      for (let i = 0; i < this.receiverList.length; i++) {
        if (this.receiverList[i].uniqueID === uniqueID) {
          this.receiverList[i].toAddress = ''
          this.receiverList[i].isReady = false
          this.receiverList[i].hasTouched = true
        }
      }
    },
    handleAmountReady (value, uniqueID) {
      for (let i = 0; i < this.receiverList.length; i++) {
        if (this.receiverList[i].uniqueID === uniqueID) {
          this.receiverList[i].transferAmount = value
          this.receiverList[i].hasTouched = true
        }
      }
    },
    handleAmountNotReady (uniqueID) {
      for (let i = 0; i < this.receiverList.length; i++) {
        if (this.receiverList[i].uniqueID === uniqueID) {
          this.receiverList[i].transferAmount = 0
          this.receiverList[i].isReady = false
          this.receiverList[i].hasTouched = true
        }
      }
    },
    clearTransferData () { // clear all transfer data inside card.
      this.receiverList = []
      this.addAReceiver()
    },
    refreshIsOwned () {
      this.isOwned = operations.isOwned(this.address)
      setTimeout(() => { this.refreshIsOwned() }, 3000)
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
    confirmTransfer () { // Confrim and send out a transfer to multiple receivers.
      for (let i = 0; i < this.receiverList.length; i++) {
        this.receiverList[i].amountEVM = utils.humanToEvm(this.receiverList[i].transferAmount.toString(), this.decimals)
        console.log(this.receiverList[i])
      }
      operations.transferTokenBulk(this.contract, this.address, this.receiverList, this.symbol)
      // operations.transferToken(this.contract, this.address, this.toAddress, evmAmount, this.transferAmount, this.symbol)
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
    },
    openWallets () {
      window.open('sync://wallets', '_blank')
    }
  },
  computed: {
    truncatedAddress () {
      return this.address.slice(0, 9) + '...'
    },
    maxTransferAllowed () {
      return parseFloat(this.tokenValue)
    },
    totalTransferAmount () {
      let total = 0
      for (let i = 0; i < this.receiverList.length; i++) {
        total += this.receiverList[i].transferAmount
      }
      return total
    },
    isBreachedMax () {
      return this.totalTransferAmount > this.maxTransferAllowed
    },
    canTransfer () {
      if (this.totalTransferAmount == 0){
        return false
      }
      // Max breached?
      if (this.isBreachedMax){
        return false
      }

      // any element that is not ready?
      for (let i = 0; i < this.receiverList.length; i++) {
        if (this.receiverList[i].isReady != true){
          return false
        }
      }

      // any element that is fresh? (not touched by user)
      for (let i = 0; i < this.receiverList.length; i++) {
        if (this.receiverList[i].hasTouched == false){
          return false
        }
      }

      return true
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
    transactionSent () { return this.$t('transferCard.transactionSent') },
    copyText () { return this.$t('transferCard.copyText') },
    addWalletText () { return this.$t('transferCard.addWalletText') },
    addAnotherReceiverText() { return this.$t('transferCard.addAnotherReceiver')}
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

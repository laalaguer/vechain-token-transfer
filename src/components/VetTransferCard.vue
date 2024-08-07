<!-- Card: Responsible for transferring VET -->
<template>
  <div>
    <b-card
      @mouseenter="imFocused"
      @mouseleave="imUnFocused"
      :border-variant="borderChoice"
      :class="[shadowChoice, 'bg-light']">

      <!-- Row of address and tokens it holds -->
      <b-row align-v="center">

        <!-- Avatar: hide on medium size screen -->
        <b-col class="d-block d-md-none" offset="0" cols="12">
          <div class="d-flex justify-content-center">
            <avatar
              class="show-hand"
              :id="address+'sm'+symbol"
              :address="address"
              my-height="64px"
              my-width="64px"
            />
          </div>

          <address-popover
            :target="address+'sm'+symbol"
            :title="truncatedAddress"
            @deleteMe="showDeleteAddressModal"
          />
        </b-col>

        <!-- Avatar: hide on small screen -->
        <b-col class="d-none d-md-block" offset-sm="0" sm="1">
          <div class="d-flex justify-content-center">
            <avatar
              class="show-hand"
              :id="address+'md'+symbol"
              :address="address"
              my-height="28px"
              my-width="28px"
            />
          </div>

          <address-popover
            :target="address+'md'+symbol"
            :title="truncatedAddress"
            @deleteMe="showDeleteAddressModal"
          />
        </b-col>

        <!-- Address: hide on small screen -->
        <b-col class="d-none d-md-block" offset="4" cols="4" offset-md="0" md="4" lg="4" xl="4">
          <div class="d-flex align-items-center">
            <font-awesome-icon
              class="show-hand"
              :icon="['fas', 'edit']"
              @click="showEditNicknameModal"
            />
            <p
              ref="exh6"
              class="ml-2 emphasis truncatetext margin-none show-hand"
              @click="copySourceAddress">{{addressOrNickname}}
            </p>
          </div>
          <b-tooltip :target="() => $refs.exh6" placement="top">
            {{copyText}}
          </b-tooltip>
        </b-col>
        <!-- VET value, on xm center and take whole space, on above take 4 cols. -->
        <b-col class="d-block d-md-none my-3" cols="12">
          <p class="margin-none text-center"><span class="text-primary">{{vetValue || '--'}}</span> {{symbol}}</p>
        </b-col>
        <b-col class="d-none d-md-block" offset-md="0" md="4" lg="4" xl="4">
          <p class="margin-none text-right"><span class="text-primary">{{vetValue || '--'}}</span> {{symbol}}</p>
        </b-col>
        <!-- if owned show transfer button -->
        <b-col class="text-center" v-if="isOwned" offset-md="0" md="4" lg="3" xl="3"  @click="toggleShowOffButton">
          <b-button v-if="showTransferButton" variant="primary" size="sm">
            {{ transferText }}
          </b-button>
          <b-button v-if="!showTransferButton" variant="outline-danger" size="sm">
            {{ modalCancelButtonText }}
          </b-button>
        </b-col>
        <!-- if not owned show add wallet button -->
        <b-col class="text-center" v-if="!isOwned" offset-md="0" md="3" lg="3" xl="3">
          <b-button variant="outline-danger" size="sm" @click="openWallets">
            {{addWalletText}}
          </b-button>
        </b-col>
      </b-row>

      <div v-if="!isMobile" style="position: absolute; right: -8px; top: -12px;" :class="trashChoice">
        <button type="button" class="close" @click="showDeleteAddressModal"><span aria-hidden="true">×</span></button>
      </div>

    <!-- Collapse: Area of transfer data input -->
    <b-collapse class="mt-3" v-model="showCollapseOfTransfer" id="collapse-transfer">
      <b-row v-for="item in receiverList" :key="item.uniqueID"><!-- Row of Address && Amount-->
        <b-col cols="12" sm="6">
          <address-box
            :label="toAddressTitle"
            :uniqueID="item.uniqueID"
            :forcedAddress="item.toAddress"
            @addressReady="handleAddressReady"
            @addressNotReady="handleAddressNotReady"
          />
        </b-col>
        <b-col cols="12" sm="5">
          <amount-box
            :label="transferAmountTitle"
            :uniqueID="item.uniqueID"
            :symbol="symbol"
            :breachedMax="isBreachedMax"
            :forcedAmount="item.transferAmount"
            @amountReady="handleAmountReady"
            @amountNotReady="handleAmountNotReady"
          />
        </b-col>
        <b-col class="d-none d-sm-block" cols="1">
          <b-form-group
            label=" "
            label-for="ban-icon"
            class="noselect py-3"
            >
            <font-awesome-icon id="ban-icon" :icon="['fas', 'ban']" @click="deleteReceiver(item.uniqueID)"/>
          </b-form-group>
        </b-col>
      </b-row>

      <hr/>
      <b-row>
        <b-col cols="12">
          <p class="show-hand">
            {{ donateToAuthorText }} *
          </p>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="7">
          <p class="show-hand" @click="addAReceiver">
            <font-awesome-icon  id="plus-icon" :icon="['fas', 'plus-circle']"/> {{ addAnotherReceiverText }}
          </p>
        </b-col>
        <b-col cols="5" style="text-align: center;">
          <p>{{transferAmountTitle}} <span class="font-weight-bold">{{totalTransferAmount.toString(10)}}</span> </p>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12">
          <p class="show-hand" @click="showUploadCSVModal">
            <font-awesome-icon  id="plus-icon" :icon="['fas', 'plus-circle']"/> {{ addByUploadFileText }}
          </p>
        </b-col>
      </b-row>

      <b-row style="text-align: center;">
        <b-col offset="0" cols="12" offset-md="4" md="4">
          <b-button block size="lg" variant="primary" @click="createTransfer">{{ createTransferButton }}</b-button>
        </b-col>
      </b-row>

    </b-collapse>

    <!-- Collapse: Area of transfer confirmation information -->
    <b-collapse v-model="showCollapseOfConfirmation" id="collapse-confirmation">
      <div class="mt-3">
        <h5>{{toAddressTitle}}</h5>
        <hr/>
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
        <hr/>
        <b-row style="text-align: center;">
          <b-col offset="8" cols="4">
             <p>{{totalTransferAmount.toString(10)}} {{symbol}}</p>
          </b-col>
        </b-row>

        <p class="text-danger" v-if="this.$store.getters.isMainNet">{{mainNetWarning}}</p>
      </div>
      <b-row style="text-align: center;">
        <b-col cols="6">
          <b-button size="lg" variant="primary" @click="confirmTransfer">{{confirmTransferButton}}</b-button>
        </b-col>
        <b-col cols="6">
          <b-button size="lg" @click="cancelTransfer">{{cancelTransferButton}}</b-button>
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

    <!-- Delete Wallet modal -->
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

    <nickname-modal
      :ref="uniqueNicknameModalID"
      :presetNickname="nickname"
      @nicknameReady="handleNicknameReady"
    />

    <upload-c-s-v-modal
      :ref="uniqueCSVModalID"
      @csvReceiversReady="handleCSVReceivers"
    />
  </div>
</template>

<script>
import AddressPopover from './AddressPopover.vue'
import AddressBox from './AddressBox.vue'
import AmountBox from './AmountBox.vue'
import Avatar from './Avatar.vue'
import UploadCSVModal from './UploadCSVModal.vue'
import NicknameModal from './NicknameModal.vue'
import copy from 'copy-to-clipboard'

const operations = require('../operations.js')
const utils = require('../utils.js')
const randomBytes = require('randombytes')

export default {
  props: {
    address: String, // Address of token holder.
    symbol: String, // Symbol of token.
    nickname: String // Nickname of this wallet.
  },
  components: {
    AddressPopover,
    AddressBox,
    AmountBox,
    Avatar,
    UploadCSVModal,
    NicknameModal
  },
  data () {
    return {
      displayDecimals: 2, // display decimals of numbers.
      vetValue: '0', // How many vet this address has, is a String type.
      vthoValue: '0', // How many energy this address has, is a String type.
      showCollapseOfTransfer: false,
      showCollapseOfConfirmation: false,
      receiverList: [],
      modalText: '',
      borderChoice: 'border',
      shadowChoice: 'shadow-sm',
      opacityChoice: 'half-dim',
      trashChoice: 'trash-none',
      showTransferButton: true,
      isOwned: false, // if self is owned address
      uniqueCSVModalID: randomBytes(7).toString('hex'),
      uniqueNicknameModalID: randomBytes(7).toString('hex'),
      displayNickname: ''
    }
  },
  beforeMount () {
    this.displayNickname = this.nickname
    this.refreshWalletBalance()
    this.refreshIsOwned()
    this.addAReceiver()
  },
  mounted () {
    this.hideAllCollapse()
    this.clearTransferData()
  },
  methods: {
    handleCSVReceivers (receiverList) {
      // console.log(receiverList)
      if (this.receiverList.length === 1 && this.receiverList[0].hasTouched === false) {
        this.receiverList = []
      }

      for (let i = 0; i < receiverList.length; i++) {
        this.receiverList.push(receiverList[i])
      }
    },
    deleteReceiver (uniqueID) {
      let position = -1
      for (let i = 0; i < this.receiverList.length; i++) {
        if (this.receiverList[i].uniqueID === uniqueID) {
          position = i
          break
        }
      }

      if (position !== -1) {
        this.receiverList.splice(position, 1)
      }
    },
    addAReceiver () {
      this.receiverList.push(
        {
          uniqueID: randomBytes(7).toString('hex'),
          toAddress: '',
          transferAmount: 0,
          isAddressReady: false,
          isAmountReady: false,
          hasTouched: false // if this element is fresh, or has been touched.
        }
      )
    },
    addDonateeReceiver (amountInt) {
      this.receiverList.push(
        {
          uniqueID: randomBytes(7).toString('hex'),
          toAddress: '0x8Cb7B1146245cc5C651CD7570Ffdb766E4F972DB',
          transferAmount: amountInt,
          isAddressReady: true,
          isAmountReady: true,
          hasTouched: true // if this element is fresh, or has been touched.
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
      this.trashChoice = 'trash-block'
    },
    imUnFocused () {
      this.borderChoice = 'border'
      this.shadowChoice = 'shadow-sm'
      this.opacityChoice = 'half-dim'
      this.trashChoice = 'trash-none'
    },
    handleAddressReady (value, uniqueID) {
      for (let i = 0; i < this.receiverList.length; i++) {
        if (this.receiverList[i].uniqueID === uniqueID) {
          this.receiverList[i].toAddress = value
          this.receiverList[i].isAddressReady = true
          this.receiverList[i].hasTouched = true
        }
      }
    },
    handleAddressNotReady (uniqueID) {
      for (let i = 0; i < this.receiverList.length; i++) {
        if (this.receiverList[i].uniqueID === uniqueID) {
          this.receiverList[i].toAddress = ''
          this.receiverList[i].isAddressReady = false
          this.receiverList[i].hasTouched = true
        }
      }
    },
    handleAmountReady (value, uniqueID) {
      for (let i = 0; i < this.receiverList.length; i++) {
        if (this.receiverList[i].uniqueID === uniqueID) {
          this.receiverList[i].transferAmount = value
          this.receiverList[i].isAmountReady = true
          this.receiverList[i].hasTouched = true
        }
      }
    },
    handleAmountNotReady (uniqueID) {
      for (let i = 0; i < this.receiverList.length; i++) {
        if (this.receiverList[i].uniqueID === uniqueID) {
          this.receiverList[i].transferAmount = 0
          this.receiverList[i].isAmountReady = false
          this.receiverList[i].hasTouched = true
        }
      }
    },
    clearTransferData () { // clear all transfer receviers inside card.
      this.receiverList = []
      this.addAReceiver()
    },
    refreshIsOwned () {
      operations.isOwned(this.address).then(res => {
        this.isOwned = res
      })
      setTimeout(() => { this.refreshIsOwned() }, 3000)
    },
    refreshWalletBalance () {
      // Refresh user vtho balance
      operations.getAccountBalance(this.address)
        .then(result => {
          this.vthoValue = utils.evmToPrintable(result['energy'], 18, this.displayDecimals)
          this.vetValue = utils.evmToPrintable(result['balance'], 18, this.displayDecimals)
          // this will result in a Promise with undefined as resolve(value).
        })
        .then(() => {
          // eslint-disable-next-line
          const ticker = connex.thor.ticker()
          ticker.next().then().then(() => { this.refreshWalletBalance() })
        })
        .catch(e => { setTimeout(() => { this.refreshWalletBalance() }, 3000) })
    },
    setModalText (text) {
      this.modalText = text
    },
    showDeleteAddressModal () {
      this.$refs.deleteAddressModal.show()
    },
    showUploadCSVModal () {
      this.$refs[this.uniqueCSVModalID].showMe()
    },
    showEditNicknameModal () {
      this.$refs[this.uniqueNicknameModalID].showMe()
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
      // donation receiver
      const fee = this.totalTransferAmount.dividedBy(1000)
      this.addDonateeReceiver(fee)

      if (this.canTransfer) {
        this.showConfirmationHideTransfer()
      }
    },
    confirmTransfer () { // Confrim and send out a transfer to multiple receivers.
      for (let i = 0; i < this.receiverList.length; i++) {
        this.receiverList[i].amountEVM = utils.humanToEvm(this.receiverList[i].transferAmount.toString(), this.decimals)
        console.log(this.receiverList[i])
      }
      operations.transferVETBulk(this.address, this.receiverList, this.symbol)
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
    },
    handleNicknameReady (newNickname) {
      // refresh UI
      this.displayNickname = newNickname
      // commit to store
      this.$store.dispatch('setUnion', { address: this.address, symbol: this.symbol, nickname: newNickname })
    }
  },
  computed: {
    isMobile () { return window.innerWidth < 768 },
    truncatedAddress () {
      // return this.address.slice(0, 9) + '...' + this.address.slice(-7)
      return this.address
    },
    addressOrNickname () {
      if (this.displayNickname !== '') {
        return this.displayNickname
      } else {
        return this.address
      }
    },
    maxTransferAllowed () { // a BigNumber
      return utils.makeBN(this.tokenValue)
    },
    totalTransferAmount () { // a BigNumber
      let total = utils.makeBN('0')
      for (let i = 0; i < this.receiverList.length; i++) {
        total = total.plus(utils.makeBN(this.receiverList[i].transferAmount))
      }
      return total
    },
    isBreachedMax () {
      return this.totalTransferAmount.isGreaterThan(this.maxTransferAllowed)
    },
    canTransfer () {
      if (this.receiverList.length === 0) {
        console.log('receiver list is empty')
        return false
      }
      if (this.totalTransferAmount.isZero()) {
        console.log('total transfer amount', this.totalTransferAmount.toString(10))
        return false
      }
      // Max breached?
      if (this.isBreachedMax) {
        console.log('isBreachedMax', this.isBreachedMax)
        return false
      }

      for (let i = 0; i < this.receiverList.length; i++) {
        // any address that is not ready?
        if (this.receiverList[i].isAddressReady !== true) {
          console.log(`this.receiverList[${i}].isAddressReady`, this.receiverList[i].isAddressReady)
          return false
        }

        // any amount that is not ready?
        if (this.receiverList[i].isAmountReady !== true) {
          console.log(`this.receiverList[${i}].isAmountReady`, this.receiverList[i].isAmountReady)
          return false
        }
        // any element that is fresh? (not touched by user)
        if (this.receiverList[i].hasTouched !== true) {
          console.log(`this.receiverList[${i}].hasTouched`, this.receiverList[i].hasTouched)
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
    copyText () { return this.$t('transferCard.copyText') + this.address },
    addWalletText () { return this.$t('transferCard.addWalletText') },
    donateToAuthorText () { return this.$t('transferCard.donateToAuthorText') },
    addAnotherReceiverText () { return this.$t('transferCard.addAnotherReceiver') },
    addByUploadFileText () { return this.$t('transferCard.addByUploadFile') }
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

.truncatetext {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trash-block {
  display: block;
}

.trash-none {
  display: none;
}

.emphasis {
  border-bottom: 1px dashed;
}
</style>

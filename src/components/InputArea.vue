<template>
  <div class="my-2">
    <b-container>
      <b-row v-if="empty" class="my-3">
      </b-row>
      <b-row v-if="empty" class="mb-3">
        <b-col cols="12" class="put-center">
          <h6>{{ hintText }}</h6>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col cols="12" class="put-center">
          <b-card style="border: 2px dashed grey;">
            <b-button class="btn-circle btn-xl" ref="exButton3" id="inputaddressbutton" :variant="themeVariant" @click="showModal">{{ buttonText }}</b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <b-tooltip @mouseover="mouseOver" @mouseleave="mouseLeave" :show.sync="showtooltip" :target="() => $refs.exButton3" placement="left">
      {{ hintText3 }}
    </b-tooltip>

    <b-modal
      ref="addaddressmodal"
      centered
      hide-header-close
      hide-header
      :ok-title="modalOkText"
      :ok-variant="themeVariant"
      :cancel-title="modalCancelText"
      @ok="handleModalOk"
      @cancel="handelModalCancel">

      <address-box
        ref="myInputBox"
        :label="modalBoxTitle"
        uniqueID=""
        forcedAddress=""
        @addressReady="handleAddressReady"
        @addressNotReady="handleAddressNotReady"
      />

      <b-form-group :label="modalTokensTitle">
        <div v-for="option in options" :key="option.value" class="my-3" style="font-size: 16px;">
          <b-form-checkbox
            v-model="selected"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </b-form-checkbox>
        </div>
    </b-form-group>

    </b-modal><!-- Enter new address modal -->
  </div>
</template>

<script>
import AddressBox from './AddressBox.vue'
const operations = require('../operations.js')
const utils = require('../utils.js')

export default {
  props: {
    empty: Boolean,
    symbol: String,
    contracts: Array
  },
  data () {
    return {
      address: '',
      showtooltip: false,
      selected: [],
      options: []
    }
  },
  beforeMount () {
    let temp = []
    for (let i = 0; i < this.contracts.length; i++) {
      temp.push({
        text: this.contracts[i].symbol,
        value: this.contracts[i].symbol,
        contractAddr: this.contracts[i].contract
      })
    }
    this.options = temp

    this.selected.push(this.symbol)
  },
  methods: {
    mouseOver () {
      this.showtooltip = true
      setTimeout(this.mouseLeave, 5000)
    },
    mouseLeave () {
      this.showtooltip = false
    },
    showModal () {
      this.$refs.addaddressmodal.show()
    },
    hideModal () {
      this.$refs.addaddressmodal.hide()
    },
    handleAddressReady (value) {
      this.address = value
      for (let i = 0; i < this.options.length; i++) {
        // set to query state.
        this.options[i].text = this.options[i].value + '...'
        // query the balance and fill.
        if (this.options[i].value !== 'VET') { // should be a token
          operations.getTokenBalance(this.options[i].contractAddr, this.address)
            .then(result => {
              let printable = utils.evmToPrintable(result['decoded']['balance'], this.decimals, 2)
              this.options[i].text = this.options[i].value + ' ' + printable
              if (printable !== '0.00') {
                this.selected.push(this.options[i].value)
              }
            })
            .catch(e => {
              console.log(e)
            })
        } else { // should be VET itself.
          operations.getAccountBalance(this.address)
            .then(result => {
              let printable = utils.evmToPrintable(result['balance'], 18)
              this.options[i].text = this.options[i].value + ' ' + printable
              if (printable !== '0.00') {
                this.selected.push(this.options[i].value)
              }
            // this will result in a Promise with undefined as resolve(value).
            })
            .catch(e => {
              console.log(e)
            })
        }
      }
    },
    handleAddressNotReady () {
      this.address = ''
    },
    handleModalOk (bvModalEvt) {
      if (this.address.length !== 0 && this.selected.length !== 0) {
        let temp = []
        this.selected.forEach(element => {
          temp.push(element)
        })
        this.$emit('addaddress', this.address.toLowerCase(), temp)
        this.$refs.myInputBox.clearBox()
        this.selected = [this.symbol]
      } else {
        bvModalEvt.preventDefault()
      }
    },
    handelModalCancel () {
      this.$refs.myInputBox.clearBox()
      this.selected = [this.symbol]
    }
  },
  computed: {
    hintText () {
      if (this.empty) {
        return this.$t('inputArea.hintText1').replace('symbol', this.symbol)
      } else {
        return this.$t('inputArea.hintText2').replace('symbol', this.symbol)
      }
    },
    hintText3 () {
      return this.$t('inputArea.hintText3').replace('symbol', this.symbol)
    },
    themeVariant () {
      return this.$store.getters.themeVariant
    },
    buttonText () { return this.$t('inputArea.buttonText') },
    modalOkText () { return this.$t('inputArea.modalOkText') },
    modalCancelText () { return this.$t('inputArea.modalCancelText') },
    modalBoxTitle () { return this.$t('inputArea.modalBoxTitle') },
    modalTokensTitle () { return this.$t('inputArea.modalTokensTitle') }
  },
  components: {
    AddressBox
  }
}
</script>

<style>
.put-center {
  text-align: center;
}

.btn-circle.btn-xl {
    width: 70px;
    height: 70px;
    padding: 10px 16px;
    border-radius: 35px;
    font-size: 36px;
    line-height: 1.33;
    /* border: 1px solid grey; */
}

.btn-circle {
    width: 30px;
    height: 30px;
    padding: 6px 0px;
    border-radius: 15px;
    text-align: center;
    font-size: 12px;
    line-height: 1.42857;
}
</style>

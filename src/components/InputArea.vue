<template>
  <div ref="exButton3" class="my-2" @mouseover="mouseOver" @mouseleave="mouseLeave">
    <b-container>
      <b-row align-h="center">
        <b-col cols="4" class="put-center">
          <b-button style="width: 140px" id="inputaddressbutton" :variant="themeVariant" @click="showModal">{{ buttonText }}</b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-tooltip :show.sync="showtooltip" :target="() => $refs.exButton3" placement="top">
      {{ hintText }}
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

    </b-modal><!-- Enter new address modal -->
  </div>
</template>

<script>
import AddressBox from './AddressBox.vue'

export default {
  props: {
    empty: Boolean,
    symbol: String
  },
  data () {
    return {
      address: '',
      showtooltip: false
    }
  },
  methods: {
    mouseOver () {
      this.showtooltip = true
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
    },
    handleAddressNotReady () {
      this.address = ''
    },
    handleModalOk () {
      if (this.address.length !== 0) {
        this.$emit('addaddress', this.address.toLowerCase())
        this.$refs.myInputBox.clearBox()
      }
    },
    handelModalCancel () {
      this.$refs.myInputBox.clearBox()
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
    themeVariant () {
      return this.$store.getters.themeVariant
    },
    buttonText () { return this.$t('inputArea.buttonText') },
    modalOkText () { return this.$t('inputArea.modalOkText') },
    modalCancelText () { return this.$t('inputArea.modalCancelText') },
    modalBoxTitle () { return this.$t('inputArea.modalBoxTitle') }
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
</style>

<!--Ask the user to input an address -->
<template>
  <div>
    <b-card>
      <b-form-group
        :label="inputAddressTitle"
        label-for="input1"
        :invalid-feedback="invalidFeedback"
        :valid-feedback="validFeedback"
        :state="state"
      >
        <b-form-row>
          <b-col cols="9" sm="9" md="10" lg="10" xl="10">
            <b-form-input id="input1" :state="state" v-model.trim="publicAddress"></b-form-input>
          </b-col>
          <b-col cols="2" sm="2" md="2" lg="2" xl="2">
            <b-button variant="primary" @click="submitNewAddress">{{addButton}}</b-button>
          </b-col>
        </b-form-row>

      </b-form-group>
    </b-card><!-- Enter new address form -->

    <b-modal
      ref="newAddressModal"
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

export default {
  data () {
    return {
      inputAddressTitle: 'Enter a new address:',
      addButton: 'Add',
      publicAddress: '',
      validFeedback: 'Looks good.',
      modalText: '',
      modalOkButtonText: 'Okay'
    }
  },
  methods: {
    handleModalOk () {
      if (this.state) {
        this.publicAddress = ''
      }
    },
    showModal () {
      this.$refs.newAddressModal.show()
    },
    hideModal () {
      this.$refs.newAddressModal.hide()
    },
    setModalTextAndShow (text) {
      this.modalText = text
      this.showModal()
    },
    submitNewAddress () { // Add new address to all addresses.
      if (!this.state) {
        this.setModalTextAndShow('Invalid address, please check.')
      } else {
        if (this.$store.getters.addresses.indexOf(this.publicAddress.toLowerCase()) !== -1) {
          this.setModalTextAndShow('Duplicate found, it is already in.')
        } else {
          this.$store.commit('addAddress', this.publicAddress.toLowerCase())
          this.setModalTextAndShow('Success! Happy transferring.')
        }
      }
    }
  },
  computed: {
    state () { // The state of input box.
      if (this.publicAddress.length === 0) {
        return null
      }
      return calc.isValidAddress(this.publicAddress.slice(2))
    },
    invalidFeedback () { // Input feedback message.
      if (!this.publicAddress.startsWith('0x')) {
        return 'Should start with 0x'
      }
      if (this.publicAddress.length < 42) {
        return 'Too short.'
      } else if (this.publicAddress.length > 42) {
        return 'Too long.'
      } else {
        if (!calc.isValidAddress(this.publicAddress.slice(2))) {
          if (!calc.onlyAlphanumeric(this.publicAddress.slice(2))) {
            return 'Only A-Z, a-z, 0-9 allowed.'
          }
          if (!calc.isEIP55Address(this.publicAddress.slice(2))) {
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

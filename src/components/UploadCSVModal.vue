<template>
    <!-- upload csv file modal -->
    <b-modal
      size="lg"
      v-model="modalShow"
      centered
      hide-header-close
      :title="uploadCSVModalTitle"
      :ok-title="modalOkButtonText"
      @ok="handleAddingReceiversOk"
      :cancel-title="modalCancelButtonText">

      <div v-if="importedReceiverList.length === 0">
        <img class="img-thumbnail rounded img-fluid" :src="iconSrc('examplecsv.jpg')"/>
      </div>

      <div class="mt-3" v-if="importedReceiverList.length === 0">
        <input @change="processFile($event)" :ref="uniqueID" type="file" accept=".csv">
      </div>

      <b-table striped hover :items="displayReceiverList"></b-table>
    </b-modal>

</template>

<script>
const randomBytes = require('randombytes')
const Papa = require('papaparse')

export default {
  props: {
  },
  data () {
    return {
      modalShow: false,
      importedReceiverList: [],
      uniqueID: randomBytes(7).toString('hex'),
      result: null,
      parseError: false
    }
  },
  mounted () {
    this.clearAll()
  },
  methods: {
    handleAddingReceiversOk () {
      if (this.importedReceiverList.length > 0) {
        this.$emit('csvReceiversReady', this.importedReceiverList)
      }
    },
    iconSrc (value) { // Return image source file
      return require('../assets/' + value)
    },
    clearAll () { // clear all the inputs, and the internal data status.
      this.importedReceiverList = []
      if (this.$refs[this.uniqueID] !== undefined) {
        this.$refs[this.uniqueID].value = null
      }
    },
    clearReceiverList () {
      this.importedReceiverList = []
    },
    showMe () {
      this.modalShow = true
      this.clearAll()
    },
    processFile (event) {
      this.clearReceiverList()

      let myfile = event.target.files[0]
      Papa.parse(myfile, {
        complete: (result) => {
          this.result = result
          // result.data => array[] => each = [address, amount]
          // result.errors => array[]
          // result.meta
          for (let i = 0; i < result.data.length; i++) {
            var parts = result.data[i]
            if (i === (result.data.length - 1)) {
              if (parts.length === 1 && parts[0] === '') { // Windows 10 + Libre Office.
                console.log('Warning: last line is empty, skipped.')
                continue
              }
            }

            if (parts.length !== 2) {
              this.parseError = true
              this.clearAll()
              alert(`Error: each line should be: | address | amount |`)
              break
            }

            let tempAddress = result.data[i][0]
            if (tempAddress.length !== 42 || !tempAddress.startsWith('0x')) {
              this.parseError = true
              this.clearAll()
              alert(`Error: ${tempAddress} is not valid address.`)
              break
            }

            let tempAmount = result.data[i][1]
            const p = /^[0-9]+.?[0-9]{0,4}$/
            if (!tempAmount.match(p)) {
              this.parseError = true
              this.clearAll()
              alert(`Error: ${tempAmount} is not valid number. Only 4 decimals allowed.`)
              break
            }

            this.importedReceiverList.push({
              uniqueID: randomBytes(7).toString('hex'),
              toAddress: result.data[i][0],
              transferAmount: parseFloat(result.data[i][1]),
              isAddressReady: true, // if address is ready.
              isAmountReady: true, // if amount is ready.
              hasTouched: true // if this element is fresh, or has been touched.
            })
          }
        }
      })
    }
  },
  computed: {
    displayReceiverList () {
      let temp = []
      for (let i = 0; i < this.importedReceiverList.length; i++) {
        temp.push({
          address: this.importedReceiverList[i].toAddress,
          amount: this.importedReceiverList[i].transferAmount
        })
      }
      return temp
    },
    addAnotherReceiverText () { return this.$t('transferCard.addAnotherReceiver') },
    addByUploadFileText () { return this.$t('transferCard.addByUploadFile') },
    uploadCSVModalTitle () { return this.$t('transferCard.uploadCSVModalTitle') },
    modalOkButtonText () { return this.$t('transferCard.modalOkButtonText') },
    modalCancelButtonText () { return this.$t('transferCard.modalCancelButtonText') }
  }
}
</script>

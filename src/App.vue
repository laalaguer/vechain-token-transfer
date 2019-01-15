<template>
  <div class="whole">
    <top-bar/><!-- Top Bar -->
    <div id="app">
      <b-container>
        <b-row class="my-2" align-h="center" v-for="address in addresses" :key="address"><!-- Rows of Transfer cards -->
          <b-col sm="12" md="8" lg="6">
            <transfer-card :address="address" symbol="TIC" contract="0x18081982d752ADd4f402AEAe480d6c90f7644427"/>
          </b-col>
        </b-row>
        <b-row class="my-2" align-h="center"><!-- Row of address input -->
          <b-col sm="12" md="8" lg="6">
            <input-address-card/>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue'
import InputAddressCard from './components/InputAddressCard.vue'
import TransferCard from './components/TransferCard.vue'

export default {
  name: 'app',
  data () {
    return {
      addresses: this.$store.getters.addresses
    }
  },
  components: {
    TopBar,
    InputAddressCard,
    TransferCard
  }
}
</script>

<style>
.whole {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  margin-top: 30px;
}
</style>

<template>
  <div class="whole">
    <top-bar :theme-variant="themeVariant"/><!-- Top Bar -->
    <div id="app">
      <b-container>
        <b-row class="my-2" align-h="center">
          <b-col sm="12" md="10" lg="8">
            <b-card no-body>
              <b-tabs card>
                <b-tab v-for="contract in contracts" :key="contract.symbol" :title="contract.symbol">
                  <tab-body-view
                    :symbol="contract.symbol"
                    :contract-address="contract.contract"
                    :decimals="contract.decimals"
                  />
                </b-tab>
              </b-tabs>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue'
import TabBodyView from './components/TabBodyView.vue'

const initData = require('./init')
const operations = require('./operations')

export default {
  name: 'app',
  data () {
    return {
      addressSymbolUnions: this.$store.getters.addressSymbolUnions,
      network: this.$store.getters.network,
      contracts: []
    }
  },
  components: {
    TopBar,
    TabBodyView
  },
  beforeMount () {
    this.initNetwork()
  },
  methods: {
    initNetwork () {
      operations.isMainNet()
        .then(result => {
          this.network = result
          this.$store.commit('changeNetwork', result)
        })
        .then(()=> {
          this.initTokenTabs()
        })
        .catch(e => {
          // TODO Ask user to F5 refresh the whole app.
        })
    },
    initTokenTabs () {
      this.contracts = initData.getContracts(this.network)
    }
  },
  computed: {
    themeVariant () {
      return this.$store.getters.themeVariant
    }
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

<template>
  <div class="whole">
    <!-- Top Bar -->
    <top-bar :theme-variant="themeVariant" :is-mainnet="$store.getters.isMainNet"/>
    <!-- Top Bar -->

    <!-- app -->
    <div id="app">
      <b-container>
        <b-row>
          <b-col lg="2" offset-lg="1" md="3" sm="2">
            <!-- col of language -->
            <div class="d-flex flex-row align-items-baseline">
              <p class="mr-2"><span><font-awesome-icon :icon="['fas','language']"/></span></p>
              <b-form-select @input="changeLanguage" v-model="selectedLanguage" :options="languageOptions" size="sm" />
            </div>
          </b-col>
        </b-row>

        <b-row class="my-2" align-h="center">
          <b-col sm="12" md="12" lg="10">
            <b-card no-body>
              <b-tabs pills card vertical>
                <b-tab v-for="contract in contracts" :key="contract.symbol">
                  <template slot="title">
                    <div>
                      <img class="align-baseline" style="width: 12px; height: 12px;" :src="iconSrc(contract.icon)"/> {{contract.symbol}}
                    </div>
                  </template>
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

        <b-row>
          <b-col cols="12" style="text-align: center;">
            <p>
              {{donateText}}:
              <a href="https://bmac.vecha.in/donate?name=laalaguer&addr=0x422D582C08d7965cD5Fefef1572faaA15783f473&amount=500&msg=Thank%20you%20for%20using%20this%20token%20tool.">0x422D582C08d7965cD5Fefef1572faaA15783f473</a>
            </p>
          </b-col>
        </b-row>
      </b-container>

      <!-- Transfer result modal -->
      <b-modal
        ref="envNotReady"
        centered
        hide-header-close
        no-close-on-backdrop
        no-close-on-esc
        ok-only
        :ok-title="noEnvModalOkayButtonText"
        @ok="downloadSync"
        :title="noEnvModalTitle">
        {{noEnvModalText}}
      </b-modal>
    </div>
    <!-- app -->
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue'
import TabBodyView from './components/TabBodyView.vue'
import { GlobalEventBus } from './events.js'

const initData = require('./init')
const operations = require('./operations')
const mstorage = require('./storage')

export default {
  name: 'app',
  data () {
    return {
      addressSymbolUnions: this.$store.getters.addressSymbolUnions,
      network: this.$store.getters.network,
      contracts: [],
      noEnvModalTitle: this.$t('app.noEnvModalTitle'),
      noEnvModalText: this.$t('app.noEnvModalText'),
      noEnvModalOkayButtonText: this.$t('app.noEnvModalOkayButtonText'),
      downloadSyncUrl: 'https://env.vechain.org/r/#' + encodeURIComponent(location.href),
      selectedLanguage: mstorage.getLanguage(),
      languageOptions: [
        { value: 'en', text: 'English' },
        { value: 'zh', text: '中文' }
      ]
    }
  },
  components: {
    TopBar,
    TabBodyView
  },
  beforeMount () {
    this.$store.dispatch('populateUnions')
    this.initNetwork()
    this.initLanguage()
  },
  methods: {
    initLanguage () {
      if (navigator.language.toLowerCase() === 'zh-CN'.toLowerCase()) {
        this.selectedLanguage = 'zh'
      } else {
        this.selectedLanguage = 'en'
      }
      this.changeLanguage()
    },
    initNetwork () {
      operations.isMainNet()
        .then(result => {
          this.network = result
          this.$store.commit('changeNetwork', result)
        })
        .then(() => {
          this.initTokenTabs()
        })
        .catch(e => {
          // TODO Ask user to go to Sync app.
          this.showModal()
        })
    },
    initTokenTabs () {
      this.contracts = initData.getContracts(this.network)
    },
    showModal () {
      this.$refs.envNotReady.show()
    },
    hideModal () {
      this.$refs.envNotReady.hide()
    },
    downloadSync (evt) { // Tell user to download sync
      evt.preventDefault()
      if (window) {
        window.open(this.downloadSyncUrl, '_blank')
      }
    },
    iconSrc (value) { // Return icon image source file
      return require('./assets/' + value)
    },
    changeLanguage () {
      this.$i18n.locale = this.selectedLanguage
      mstorage.setLanguage(this.selectedLanguage)
    }
  },
  computed: {
    themeVariant () {
      return this.$store.getters.themeVariant
    },
    donateText () { return this.$t('app.donateText') }
  },
  mounted () {
    GlobalEventBus.$on('myglobalevent', () => {
      console.log('hahahaha')
    })
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

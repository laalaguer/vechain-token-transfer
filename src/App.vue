<template>
  <div class="whole">
    <!-- Top Bar -->
    <top-bar :theme-variant="themeVariant" :is-mainnet="$store.getters.isMainNet"/>
    <!-- Top Bar -->

    <!-- app -->
    <div id="app">
      <b-container>
        <b-row class="my-2" align-h="center">
          <b-col sm="12" md="10" lg="8">
            <b-card no-body>
              <b-tabs card>
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

    <!-- footer -->
    <footer>
      <div class="text-center py-3 d-flex flex-row justify-content-center align-items-baseline">
        <div class="mx-2">
          <font-awesome-icon :icon="['fab','github']"/>
          Github:
          <a class="mx-1" href="https://github.com/laalaguer/VeChain-Token-Transfer" target="_blank">{{ $t('app.code') }}</a>
        </div>

        <div class="d-flex flex-row align-items-baseline mx-2">
          <p class="mx-1"><span><font-awesome-icon :icon="['fas','language']"/></span></p>
          <b-form-select @input="changeLanguage" v-model="selectedLanguage" :options="languageOptions" size="sm" />
        </div>
      </div>
    </footer>
    <!-- footer -->
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue'
import TabBodyView from './components/TabBodyView.vue'

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
      downloadSyncUrl: 'https://github.com/vechain/thor-sync.electron',
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

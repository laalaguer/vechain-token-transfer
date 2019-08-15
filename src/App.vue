<template>
  <div class="whole">
    <!-- Top Bar -->
    <top-bar :theme-variant="themeVariant" :is-mainnet="$store.getters.isMainNet"/>
    <!-- Top Bar -->

    <!-- app -->
    <div id="app">
      <b-container>
        <b-row>
          <b-col cols="12" class="mt-2 mb-2">
            <div class="d-flex justify-content-center">
              <a href="#" @click="setLanguage('zh')">中文 </a> || <a href="#" @click="setLanguage('en')">English</a>
            </div>
          </b-col>
        </b-row>

        <b-row class="my-2" align-h="center">
          <b-col sm="12" md="12" lg="10">
            <b-card no-body>
              <b-tabs card pills fill>
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

        <footer class="pt-4 pt-md-5">
          <b-row class="text-center">
            <b-col cols="12" md="4" offset-lg="1" lg="3">
              <img class="mb-2" :src="iconSrc('favicon-32x32.png')" alt="" width="24" height="24">
              <small class="d-block mb-3 text-muted">&copy; 2018-2019</small>
            </b-col>
            <b-col cols="12" md="8" lg="4">
              <h5>{{donateText}}</h5>
              <a class="d-block mb-3" target="_blank" href="https://bmac.vecha.in/donate?name=laalaguer&addr=0x422D582C08d7965cD5Fefef1572faaA15783f473&amount=500&msg=Thank%20you%20for%20using%20this%20token%20tool.">0x422D582C08d7965cD5Fefef1572faaA15783f473</a>
            </b-col>
            <b-col cols="12" md="12" lg="3">
              <h5>Github</h5>
              <div class="d-flex flex-row justify-content-center align-items-stretch">
                <github-button class="mr-1" href="https://github.com/laalaguer/vechain-token-transfer" data-size="small" data-show-count="true" aria-label="Star laalaguer/vechain-token-transfer on GitHub">Star</github-button>
                <github-button class="ml-1" href="https://github.com/laalaguer" data-size="small" data-show-count="true" aria-label="Follow @laalaguer on GitHub">Follow</github-button>
              </div>
            </b-col>
          </b-row>
        </footer>
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
import GithubButton from 'vue-github-button'

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
    GithubButton,
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
        // window.open(this.downloadSyncUrl, '_blank')
        window.open('https://env.vechain.org/', '_blank')
      }
    },
    iconSrc (value) { // Return icon image source file
      return require('./assets/' + value)
    },
    changeLanguage () {
      this.$i18n.locale = this.selectedLanguage
      mstorage.setLanguage(this.selectedLanguage)
    },
    setLanguage (value) {
      this.selectedLanguage = value
      this.changeLanguage()
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
</style>

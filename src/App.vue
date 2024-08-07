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
              <b-form-group
              >
                <b-form-radio-group
                  id="btn-radios-language"
                  v-model="selectedLanguage"
                  :options="languageOptions"
                  @change="setLanguage"
                  button-variant="outline-primary"
                  name="radio-btn-outline"
                  size="sm"
                  buttons
                ></b-form-radio-group>
              </b-form-group>
            </div>
          </b-col>
        </b-row>

        <b-row class="my-2" align-h="center">
          <b-col sm="12" md="12" lg="10">
            <b-card no-body>
              <!-- :pills="isMobile" -->
              <!-- :vertical -->
              <b-tabs card pills v-model="tabIndex" @input="tabChangedFunction">
                <b-tab v-for="contract in contracts" :key="contract.symbol">
                  <template slot="title">
                    <div style="text-align: center">
                      <img style="height: 18px;" :src="iconSrc(contract.icon)"/>
                      <p class="mt-1 pb-0 mb-0">{{contract.symbol}}</p>
                    </div>
                  </template>
                  <tab-body-view
                    :symbol="contract.symbol"
                    :contract-address="contract.contract"
                    :decimals="contract.decimals"
                    :contracts="contracts"
                  />
                </b-tab>
              </b-tabs>
            </b-card>
          </b-col>
        </b-row>

        <footer class="pt-4 pt-md-5">
          <b-row class="text-center">
            <b-col class="mb-3" cols="12" md="4" offset-lg="1" lg="3">
              <img class="mb-2" :src="iconSrc('favicon-32x32.png')" alt="" width="24" height="24">
              <small class="d-block text-muted">&copy; 2018-2019</small>
            </b-col>
            <b-col class="mb-3" cols="12" md="8" lg="4">
              <h5>{{donateText}}</h5>
              <a href="#" v-b-modal.donation-modal>0x8Cb7B1146245cc5C651CD7570Ffdb766E4F972DB</a>
            </b-col>
            <b-col class="mb-3" cols="12" md="12" lg="3">
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

      <!-- Donation modal -->
      <b-modal
        :title="donateChoicesText"
        id="donation-modal"
        ref="donation"
        centered
        hide-header-close
        hide-footer
        >
        <div>
          <p>1. {{donateByCopy}}</p>
          <copy-input disabled="true" icon-name="fa-address-card" textToCopy="0x8Cb7B1146245cc5C651CD7570Ffdb766E4F972DB"></copy-input>
        </div>
      </b-modal>
    </div>
    <!-- app -->
  </div>
</template>

<script>
import CopyInput from './components/CopyInput.vue'
import TopBar from './components/TopBar.vue'
import TabBodyView from './components/TabBodyView.vue'
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
      ],
      tabIndex: mstorage.getRememberedTabIndex()
    }
  },
  components: {
    GithubButton,
    TopBar,
    TabBodyView,
    CopyInput
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
    },
    tabChangedFunction (tabIndex) {
      mstorage.setRememberedTabIndex(tabIndex)
    }
  },
  computed: {
    themeVariant () {
      return this.$store.getters.themeVariant
    },
    donateText () { return this.$t('app.donateText') },
    donateChoicesText () { return this.$t('app.donateChoicesText') },
    donateByCopy () { return this.$t('app.donateByCopy') },
    donateByBuyMeACoffee () { return this.$t('app.donateByBuyMeACoffee') },
    isMobile () { return window.innerWidth < 768 }
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

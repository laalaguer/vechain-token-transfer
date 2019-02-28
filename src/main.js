import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import store from './store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faTrash, faAngleDoubleDown, faAngleDoubleUp, faLanguage, faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons'
import i18n from './i18n/i18n'
import Toasted from 'vue-toasted'

Vue.use(Toasted)
Vue.use(BootstrapVue)

library.add(faAngleDoubleDown)
library.add(faAngleDoubleUp)
library.add(faTrash)
library.add(faGithub)
library.add(faLanguage)
library.add(faHandHoldingUsd)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

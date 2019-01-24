import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './langs'
const mstorage = require('../storage')

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: mstorage.getLanguage() || 'en', // get localStorage, default en
  messages
})

export default i18n

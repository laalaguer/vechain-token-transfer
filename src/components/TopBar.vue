<template>
  <b-navbar toggleable="md" type="dark" :variant="themeVariant">
    <b-navbar-toggle target="nav_text_collapse"></b-navbar-toggle>
    <b-navbar-brand>{{ $t('topBar.title') }}</b-navbar-brand>
    <b-collapse is-nav id="nav_text_collapse">
      <b-navbar-nav>
          <b-nav-text><b-badge variant="light">{{ network }}</b-badge></b-nav-text>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  props: {
    themeVariant: String,
    isMainnet: Boolean
  },
  data () {
    return {
    }
  },
  computed: {
    network () {
      if (this.isMainnet) {
        return this.$t('topBar.mainnet')
      } else {
        return this.$t('topBar.testnet')
      }
    }
  }
}
</script>

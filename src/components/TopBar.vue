<template>
  <b-container style="margin-top:40px;">
    <b-row align-h="center" class="my-2">
      <b-col cols="12" class="text-center">
        <h3>{{ $t('topBar.title') }} <b-badge :variant="themeVariant">{{ network }}</b-badge></h3>
      </b-col>
    </b-row>
  </b-container>
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

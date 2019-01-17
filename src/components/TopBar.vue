<template>
  <b-navbar toggleable="md" type="dark" :variant="themeVariant">
    <b-navbar-brand>{{ title }}</b-navbar-brand>
  </b-navbar>
</template>

<script>
export default {
  props: {
    themeVariant: String
  },
  data () {
    return {
      title: 'VeChain Token Transfer'
    }
  }
}
</script>

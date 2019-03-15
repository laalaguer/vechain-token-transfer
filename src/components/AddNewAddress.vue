<!-- A button to launch a dialog to input address -->
<template>
  <div>
    <b-button @click="clickMe()">xxxx</b-button>
  </div>
</template>
<script>
import { GlobalEventBus } from '../events.js'

export default {
  data () {
    return {}
  },
  methods: {
    clickMe () {
      GlobalEventBus.$emit('myglobalevent')
    }
  }
}
</script>

<style>

</style>

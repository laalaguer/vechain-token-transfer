<template>
  <div :style="myStyle">
  </div>
</template>

<script>
import { picasso } from '@vechain/picasso'

export default {
  props: {
    address: String, // eg. 0xabcdefg
    myHeight: String, // eg. 100px
    myWidth: String // eg. 100px
  },
  methods: {
    createBackground (address) {
      const mySVG = picasso(address)
      return `no-repeat url('data:image/svg+xml;utf8,${mySVG}')`
    }
  },
  computed: {
    myStyle () {
      const bg = this.createBackground(this.address)
      return `border-radius: 12px; height: ${this.myHeight}; width: ${this.myWidth}; background: ${bg}`
    }
  }
}
</script>

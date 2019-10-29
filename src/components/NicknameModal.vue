<template>
  <b-modal
    :ref="ref"
    :ok-title="okTitle"
    :cancel-title="cancelTitle"
    centered
    hide-header-close
  />
</template>

<script>
export default {
  props: {
    ref: String
  },
  data () {
    return {
      okTitle: 'OK',
      cancelTitle: 'Cancel'
    }
  }
}
</script>
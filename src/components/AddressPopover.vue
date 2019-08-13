<template>
  <b-popover
    :target="target"
    :title="title"
    :show.sync="show"
    triggers="click blur"
    placement="top"
  >

  <div class="d-flex justify-content-between">
    <b-button variant="outline-secondary" size="sm" @click="dismissBubble">
      {{ goBackButtonText }}
    </b-button>
    <b-button variant="danger" size="sm" @click="emitDeleteEvent">
      {{ deleteButtonText }}
    </b-button>

  </div>

  </b-popover>
</template>
<script>
export default {
  props: {
    target: String, // which element shall this popup target at?
    title: String // what title shall this popup have?
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    emitDeleteEvent () {
      this.$emit('deleteMe')
      this.show = false
    },
    dismissBubble () {
      this.show = false
    }
  },
  computed: {
    deleteButtonText () { return this.$t('transferCard.deleteText') },
    goBackButtonText () { return this.$t('transferCard.goBackText') }
  }
}
</script>
